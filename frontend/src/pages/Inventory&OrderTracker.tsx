import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  format,
  isAfter,
  isBefore,
  parseISO,
  formatISO,
} from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, ArrowDown, ArrowUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponsiveLine } from "@nivo/line";
import { cn } from "@/lib/utils";
import AppLayout from "@/layouts/AppLayout";
import inventoryData from "@/data/inventory.json";
import orderData from "@/data/orders.json";
import forecastData from "@/data/inventory_forecast.json";

function groupByKey<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function getDefaultRange(dates: Date[]): DateRange | undefined {
  if (dates.length === 0) return undefined;
  const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
  return { from: sorted[0], to: addDays(sorted[sorted.length - 1], 1) };
}

const InventoryTracker = () => {
  const allInventory = useMemo(
    () =>
      inventoryData.map((item) => ({
        ...item,
        parsedDate: parseISO(item.expected_restock_date),
      })),
    []
  );

  const allOrders = useMemo(
    () =>
      orderData.map((order) => ({
        ...order,
        parsedDate: parseISO(order.delivery_due_date),
        risk_score:
          order.risk_status === "High"
            ? 5
            : order.risk_status === "Medium"
            ? 3
            : 1,
      })),
    []
  );

  const allDates = [
    ...allInventory.map((i) => i.parsedDate),
    ...allOrders.map((o) => o.parsedDate),
  ];

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getDefaultRange(allDates)
  );
  const [region, setRegion] = useState("All");
  const [riskCategory, setRiskCategory] = useState("All");

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const inRange =
        (!dateRange?.from || !isBefore(order.parsedDate, dateRange.from)) &&
        (!dateRange?.to || !isAfter(order.parsedDate, dateRange.to));
      const regionMatch = region === "All" || order.region === region;
      const riskMatch =
        riskCategory === "All" || order.risk_status === riskCategory;
      return inRange && regionMatch && riskMatch;
    });
  }, [allOrders, dateRange, region, riskCategory]);

  const totalAtRiskValue = filteredOrders.reduce(
    (sum, o) => sum + (o.order_value || 0),
    0
  );
  const totalAtRiskQty = filteredOrders.reduce(
    (sum, o) => sum + (o.order_quantity || 0),
    0
  );

  const prevDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      from: addDays(dateRange.from, -7),
      to: addDays(dateRange.to, -7),
    };
  }, [dateRange]);

  const prevFilteredOrders = useMemo(() => {
    if (!prevDateRange) return [];
    return allOrders.filter((order) => {
      const inRange =
        (!prevDateRange.from ||
          !isBefore(order.parsedDate, prevDateRange.from)) &&
        (!prevDateRange.to || !isAfter(order.parsedDate, prevDateRange.to));
      const regionMatch = region === "All" || order.region === region;
      const riskMatch =
        riskCategory === "All" || order.risk_status === riskCategory;
      return inRange && regionMatch && riskMatch;
    });
  }, [allOrders, prevDateRange, region, riskCategory]);

  const prevTotalAtRiskValue = prevFilteredOrders.reduce(
    (sum, o) => sum + (o.order_value || 0),
    0
  );
  const prevTotalAtRiskQty = prevFilteredOrders.reduce(
    (sum, o) => sum + (o.order_quantity || 0),
    0
  );

  const valueDelta = prevTotalAtRiskValue
    ? ((totalAtRiskValue - prevTotalAtRiskValue) / prevTotalAtRiskValue) * 100
    : 0;
  const qtyDelta = prevTotalAtRiskQty
    ? ((totalAtRiskQty - prevTotalAtRiskQty) / prevTotalAtRiskQty) * 100
    : 0;

  const weeks = Array.from(
    new Set(filteredOrders.map((o) => o.delivery_due_week))
  ).sort();
  const skus = Array.from(new Set(filteredOrders.map((o) => o.sku)));

  const heatmapData = weeks.map((week) => {
    const row: Record<string, any> = { week };
    for (const sku of skus) {
      const orders = filteredOrders.filter(
        (o) => o.delivery_due_week === week && o.sku === sku
      );
      const avgRisk = orders.length
        ? orders.reduce((sum, o) => sum + o.risk_score, 0) / orders.length
        : 0;
      row[sku] = avgRisk;
    }
    return row;
  });

  const forecastChartData = useMemo(() => {
    const grouped = groupByKey(forecastData, (item) => item.sku);
    return Object.entries(grouped).map(([sku, rows]) => ({
      id: sku,
      data: rows
        .map((r) => {
          let dateStr: string;
          if (typeof r.date === "number") {
            const excelEpoch = new Date(Date.UTC(1899, 11, 30));
            const correctedDate = new Date(
              excelEpoch.getTime() + r.date * 86400000
            );
            dateStr = formatISO(correctedDate, { representation: "date" });
          } else if (
            typeof r.date === "object" &&
            r.date !== null &&
            "getTime" in r.date
          ) {
            dateStr = formatISO(r.date, { representation: "date" });
          } else {
            dateStr = String(r.date);
          }

          return {
            x: dateStr,
            y: r.projected_tonnage,
          };
        })
        .filter((point) => {
          const date = parseISO(point.x);
          return (
            (!dateRange?.from || !isBefore(date, dateRange.from)) &&
            (!dateRange?.to || !isAfter(date, dateRange.to))
          );
        }),
    }));
  }, [forecastData, dateRange]);

  const chartColors = ["#cc9aff", "#afd14d", "#ff4e4e"];

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    forecastChartData.forEach((line, index) => {
      map[line.id] = chartColors[index % chartColors.length];
    });
    return map;
  }, [forecastChartData]);

  const [visibleSkus, setVisibleSkus] = useState<string[]>([]);

  useEffect(() => {
    setVisibleSkus(forecastChartData.map((line) => line.id));
  }, [forecastChartData]);

  const toggleSku = (sku: string) => {
    setVisibleSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const displayedForecastData = forecastChartData.filter((line) =>
    visibleSkus.includes(line.id)
  );

  const today = formatISO(new Date(), { representation: "date" });

  const DeltaIndicator = ({ delta }: { delta: number }) => {
    const positive = delta >= 0;
    const Icon = positive ? ArrowUp : ArrowDown;
    return (
      <div
        className={cn(
          "flex items-center",
          positive ? "text-green-600" : "text-red-600"
        )}
      >
        <Icon className="h-4 w-4 mr-1" />
        <span className="text-sm">
          {Math.abs(delta).toFixed(1)}% vs last week
        </span>
      </div>
    );
  };

  return (
    <AppLayout title="Inventory and Order Tracker">
      <div className="p-6">
        <div className="gap-6">
          <div className="flex gap-2 w-full pb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal bg-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskCategory} onValueChange={setRiskCategory}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Orders At Risk (Value)
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start justify-center space-y-2">
                  <p className="text-left text-3xl font-bold text-red-600">
                    ₹{(totalAtRiskValue / 1000).toFixed(1)}K
                  </p>
                  <DeltaIndicator delta={valueDelta} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Orders At Risk (Qty)
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start justify-center space-y-2">
                  <p className="text-left text-3xl font-bold text-red-600">
                    ₹{(totalAtRiskQty / 1000).toFixed(1)}K
                  </p>
                  <DeltaIndicator delta={qtyDelta} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="overflow-auto rounded">
                <h2 className="text-lg font-semibold mb-4">
                  Orders Risk Heatmap
                </h2>
                <table className="w-full text-sm text-center border border-gray-200">
                  <thead>
                    <tr className="bg-green-800 text-white">
                      <th className="border px-2 py-1">SKU</th>
                      {weeks.map((week) => (
                        <th key={week} className="border px-2 py-1">
                          {week}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {skus.map((sku) => (
                      <tr key={sku}>
                        <td className="border px-2 py-1 font-medium">
                          {sku}
                        </td>
                        {weeks.map((week) => {
                          const avgRisk =
                            heatmapData.find((row) => row.week === week)?.[
                              sku
                            ] ?? 0;

                          // Determine background color
                          let bgColor = "";
                          let textColor = "black";
                          if (avgRisk >= 4) {
                            bgColor = "#cc9aff"; // purple
                          } else if (avgRisk >= 2) {
                            bgColor = "#afd14d"; // greenish
                          } else {
                            bgColor = "#ff4e4e"; // red
                            textColor = "white";
                          }

                          return (
                            <td
                              key={week}
                              className="border px-2 py-1"
                              style={{
                                backgroundColor: bgColor,
                                color: textColor,
                              }}
                              title={`SKU: ${sku}\nWeek: ${week}\nAvg Risk Score: ${avgRisk.toFixed(
                                1
                              )}`}
                            >
                              {avgRisk.toFixed(1)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>End Product Inventory Risk Profile</CardTitle>
                </CardHeader>
                <CardContent className="h-[480px]">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {forecastChartData.map((line) => (
                      <div
                        key={line.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`chk-${line.id}`}
                          checked={visibleSkus.includes(line.id)}
                          onCheckedChange={() => toggleSku(line.id)}
                        />
                        <label
                          htmlFor={`chk-${line.id}`}
                          className="flex items-center space-x-2"
                        >
                          <span
                            className="inline-block w-4 h-4 rounded"
                            style={{ backgroundColor: colorMap[line.id] }}
                          />
                          <span className="text-sm whitespace-nowrap">
                            {line.id}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <ResponsiveLine
                    data={displayedForecastData}
                    margin={{ top: 10, right: 50, bottom: 100, left: 50 }}
                    xScale={{
                      type: "time",
                      format: "%Y-%m-%d",
                      precision: "day",
                    }}
                    yScale={{ type: "linear", min: 0 }}
                    axisBottom={{
                      format: "%b %d",
                      tickValues: "every 1 week",
                      legend: "Forecast Date",
                      legendOffset: 36,
                      legendPosition: "middle",
                    }}
                    axisLeft={{
                      legend: "Tonnage",
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    pointSize={6}
                    useMesh
                    enableSlices="x"
                    curve="monotoneX"
                    colors={({ id }) => colorMap[id as string]}
                    sliceTooltip={({ slice }) => (
                      <div className="bg-white p-2 rounded shadow text-xs">
                        {slice.points.map((point) => (
                          <div key={point.id}>
                            <strong>{(point as any).serieId}</strong>:{" "}
                            {point.data.yFormatted}t on{" "}
                            {format(parseISO(point.data.x as string), "MMM d")}
                          </div>
                        ))}
                      </div>
                    )}
                    markers={[
                      {
                        axis: "x",
                        value: today,
                        lineStyle: {
                          stroke: "#000",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default InventoryTracker;
