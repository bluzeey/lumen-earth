import { useMemo, useState } from "react";
import {
  addDays,
  format,
  isAfter,
  isBefore,
  parseISO,
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import orderData from "@/data/orders.json";

function getDefaultRange(dates: Date[]): DateRange | undefined {
  if (dates.length === 0) return undefined;
  const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
  return { from: sorted[0], to: addDays(sorted[sorted.length - 1], 1) };
}

export default function OrderTracker() {
  const orders = useMemo(
    () =>
      orderData.map((o) => ({
        ...o,
        parsedDate: parseISO(o.delivery_due_date),
      })),
    []
  );

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getDefaultRange(orders.map((o) => o.parsedDate))
  );
  const [region, setRegion] = useState("All");
  const [risk, setRisk] = useState("All");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const inRange =
        (!dateRange?.from || !isBefore(o.parsedDate, dateRange.from)) &&
        (!dateRange?.to || !isAfter(o.parsedDate, dateRange.to));
      const regionMatch = region === "All" || o.region === region;
      const riskMatch = risk === "All" || o.risk_status === risk;
      return inRange && regionMatch && riskMatch;
    });
  }, [orders, dateRange, region, risk]);

  const totalValue = filtered.reduce((sum, o) => sum + (o.order_value || 0), 0);
  const totalQty = filtered.reduce((sum, o) => sum + (o.order_quantity || 0), 0);

  return (
    <AppLayout title="Order Tracker">
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-xl font-semibold">Order Tracker</h1>
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
                        {format(dateRange.from, "LLL dd, y")} -{' '}
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
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>

            <Select value={risk} onValueChange={setRisk}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Risk" />
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

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="rounded-md border p-4">
            <div className="text-sm font-medium">Orders Value</div>
            <div className="text-2xl font-bold">
              ₹{(totalValue / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm font-medium">Orders Qty</div>
            <div className="text-2xl font-bold">{totalQty}</div>
          </div>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#204936] text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                <TableHead className="p-3">Order ID</TableHead>
                <TableHead className="p-3">SKU</TableHead>
                <TableHead className="p-3">Quantity</TableHead>
                <TableHead className="p-3">Value</TableHead>
                <TableHead className="p-3">Region</TableHead>
                <TableHead className="p-3">Risk</TableHead>
                <TableHead className="p-3">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.order_id} className="border-b">
                  <TableCell>{o.order_id}</TableCell>
                  <TableCell>{o.sku}</TableCell>
                  <TableCell>{o.order_quantity}</TableCell>
                  <TableCell>₹{o.order_value}</TableCell>
                  <TableCell>{o.region}</TableCell>
                  <TableCell>{o.risk_status}</TableCell>
                  <TableCell>{format(o.parsedDate, "LLL dd, y")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
