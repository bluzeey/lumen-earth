import { useMemo, useState } from "react";
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
import { CalendarIcon } from "lucide-react";
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

const riskColor = (score: number) => {
  if (score >= 4) return "bg-[#cc9aff] text-black";
  if (score >= 2) return "bg-[#afd14d] text-black";
  return "bg-[#ff4e4e] text-white";
};

const chartColors = ["#cc9aff", "#afd14d", "#ff4e4e"];

const OrderTracker = () => {
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

  return (
    <AppLayout title="Inventory Tracker">
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-xl font-semibold">Inventory and Order Tracker</h1>
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[260px] justify-start text-left font-normal"
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
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskCategory} onValueChange={setRiskCategory}>
              <SelectTrigger className="w-[180px]">
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
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Orders At Risk (Value)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                ₹{(totalAtRiskValue / 1000).toFixed(1)}K
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Orders At Risk (Qty)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                ₹{(totalAtRiskQty / 1000).toFixed(1)}K
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Risk Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto rounded">
              <table className="min-w-full text-sm text-center">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Week</th>
                    {skus.map((sku) => (
                      <th key={sku} className="border px-2 py-1">
                        {sku}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.week}>
                      <td className="border px-2 py-1 font-medium">
                        {row.week}
                      </td>
                      {skus.map((sku) => (
                        <td
                          key={sku}
                          className={cn(
                            "border px-2 py-1",
                            riskColor(row[sku])
                          )}
                        >
                          {row[sku]?.toFixed(1) || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>End Product Inventory Risk Profile</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveLine
                data={forecastChartData}
                margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
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
                  legendOffset: 40,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  legend: "Tonnage",
                  legendOffset: -50,
                  legendPosition: "middle",
                }}
                pointSize={6}
                enablePoints={true}
                useMesh
                enableSlices="x"
                lineWidth={4}
                curve="monotoneX"
                colors={chartColors}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderTracker;
