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
import { Card, CardHeader, CardTitle,CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponsiveLine } from "@nivo/line";
import { cn } from "@/lib/utils";
import AppLayout from "@/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import inventoryData from "@/data/inventory.json";
import orderData from "@/data/orders.json";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import forecastData from "@/data/inventory_forecast.json";
import { RiskHeatmapTable } from "@/components/inventory-order-tracker/RiskHeatmapTable";

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
        // Ensure the date is parsed from a string to avoid `split` errors
        parsedDate: parseISO(String(item.expected_restock_date)),
      })),
    []
  );

  const allOrders = useMemo(
    () =>
      orderData.map((order) => ({
        ...order,
        // Coerce delivery date to string before parsing
        parsedDate: parseISO(String(order.delivery_due_date)),
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

  interface HeatmapRow {
    week: string;
    [sku: string]: number | string;
  }

  const weeks = Array.from(
    new Set(filteredOrders.map((o) => String(o.delivery_due_week)))
  ).sort();
  const skus = Array.from(new Set(filteredOrders.map((o) => o.sku)));

  const heatmapData: HeatmapRow[] = weeks.map((week) => {
    const row: HeatmapRow = { week };
    for (const sku of skus) {
      const orders = filteredOrders.filter(
        (o) => String(o.delivery_due_week) === week && o.sku === sku
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
          const date = parseISO(String(point.x));
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

  return (
    <AppLayout title="Inventory and Order Tracker">
      <div className="p-6">
        <div className="gap-6">
          {/* Filters */}
          <div className="flex gap-2 w-1/2 pb-6">
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
  
          {/* Grid layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Left side: Cards + Heatmap */}
            <div className="space-y-4 col-span-1 xl:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Orders At Risk Value */}
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Orders At Risk (Value)</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
                      ₹{(totalAtRiskValue / 1000).toFixed(1)}K
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline" className={cn(valueDelta >= 0 ?  "text-red-600" : "text-green-600")}> 
                        {valueDelta >= 0 ? <IconTrendingUp /> : <IconTrendingDown />} 
                        {Math.abs(valueDelta).toFixed(1)}%
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {valueDelta >= 0 ? "Increased from last week" : "Decreased from last week"}
                    </div>
                    <div className="text-muted-foreground">Week-over-week change</div>
                  </CardFooter>
                </Card>
  
                {/* Orders At Risk Qty */}
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Orders At Risk (Qty)</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
                      ₹{(totalAtRiskQty / 1000).toFixed(1)}K
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline" className={cn(qtyDelta >= 0 ? "text-red-600" : "text-green-600")}> 
                        {qtyDelta >= 0 ? <IconTrendingUp /> : <IconTrendingDown />} 
                        {Math.abs(qtyDelta).toFixed(1)}%
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {qtyDelta >= 0 ? "Increased from last week" : "Decreased from last week"}
                    </div>
                    <div className="text-muted-foreground">Week-over-week change</div>
                  </CardFooter>
                </Card>
              </div>
  
              {/* Heatmap table */}
              <div className="rounded-lg bg-white pt-2 border overflow-auto p-4">
                <h2 className="text-lg font-semibold mt-2 mb-4">
                  Orders Risk Heatmap
                </h2>
                <RiskHeatmapTable
                  heatmapData={heatmapData}
                  weeks={weeks}
                  skus={skus}
                />
              </div>
            </div>
  
            {/* Right side: Graph */}
            <div className="h-3/4 w-full col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>End Product Inventory Risk Profile</CardTitle>
                </CardHeader>
                <CardContent className="h-[700px] flex flex-col">
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
                    animate={true}
                    motionConfig="gentle"
                    margin={{ top: 10, right: 50, bottom: 160, left: 50 }}
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
                            {format(
                              typeof point.data.x === "string"
                                ? parseISO(point.data.x)
                                : (point.data.x as Date),
                              "MMM d"
                            )}
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
