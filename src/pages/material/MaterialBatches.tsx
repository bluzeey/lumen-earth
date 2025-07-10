import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AppLayout from "@/layouts/AppLayout";

type DateRange = {
  from: Date;
  to: Date;
};

// Dummy batch list (replace with real API)
const mockBatches = Array.from({ length: 37 }).map((_, i) => ({
  id: `BATCH-${1000 + i}`,
  source: ["Factory", "Hotel", "Hospital"][i % 3],
  material: ["Cotton", "Polyester", "Nylon"][i % 3],
  date: new Date(2024, i % 12, ((i * 2) % 28) + 1),
  weight: 100 + i * 10,
  status: i % 2 === 0 ? "complete" : "incomplete",
}));

const sources = ["All", "Factory", "Hotel", "Hospital"];
const materials = ["All", "Cotton", "Polyester", "Nylon"];

export default function MaterialBatchesPage() {
  const navigate = useNavigate();
  const [data] = useState(mockBatches);
  const [filtered, setFiltered] = useState(mockBatches);

  const [sourceFilter, setSourceFilter] = useState("All");
  const [materialFilter, setMaterialFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"date" | "weight">("date");

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    let temp = [...data];
    if (sourceFilter !== "All") {
      temp = temp.filter((b) => b.source === sourceFilter);
    }
    if (materialFilter !== "All") {
      temp = temp.filter((b) => b.material === materialFilter);
    }
    if (dateRange?.from && dateRange?.to) {
      temp = temp.filter(
        (b) => b.date >= dateRange.from && b.date <= dateRange.to
      );
    }
    temp.sort((a, b) =>
      sortBy === "date"
        ? b.date.getTime() - a.date.getTime()
        : b.weight - a.weight
    );
    setFiltered(temp);
    setPage(1);
  }, [sourceFilter, materialFilter, dateRange, sortBy, data]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Material Batches</h1>
          <Button onClick={() => navigate({ to: "/material/new" })}>
            + New Batch
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-sm font-medium">Source</label>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sources.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Material Type</label>
            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {materials.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-60 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, "MMM d")} – ${format(
                        dateRange.to,
                        "MMM d, yyyy"
                      )}`
                    : "Pick a date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range as DateRange)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((batch) => (
                  <TableRow
                    key={batch.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate({ to: `/material/${batch.id}` })}
                  >
                    <TableCell>{batch.id}</TableCell>
                    <TableCell>{batch.source}</TableCell>
                    <TableCell>{batch.material}</TableCell>
                    <TableCell>{format(batch.date, "PPP")}</TableCell>
                    <TableCell>{batch.weight}</TableCell>
                    <TableCell className="capitalize">{batch.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No batches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pageCount) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </AppLayout>
  );
}
