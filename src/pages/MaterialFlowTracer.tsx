import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import { SankeyChart } from "@/components/SankeyChart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isWithinInterval, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";

type EnrichedBatch = {
  composition?: string;
  sourceName?: string;
  batchId: string;
  materialName: string;
  supplierName?: string;
  materialComposition?: string;
  rawMaterialQty?: string | number;
  collectedQty?: string | number;
  categorizedQty?: string | number;
  yieldPercentage?: string | number;
  dateOfDispatchFromSource?: string;
  dateReceivedAtCollection?: string;
  dateOfCategorization?: string;
  parsedDate?: Date;
};

type DateRange = { from: Date; to: Date };

function getDefaultRange(dates: Date[]): DateRange | undefined {
  if (dates.length === 0) return undefined;
  const latest = dates[0];
  const start = subDays(latest, 6);
  return { from: start, to: latest };
}

export default function MaterialFlowTracer() {
  const [parsedBatches, setParsedBatches] = useState<EnrichedBatch[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      fetch("/data/batches.xlsx").then((res) => res.blob()),
      fetch("/data/materials.xlsx").then((res) => res.blob()),
      fetch("/data/sources.xlsx").then((res) => res.blob()),
      fetch("/data/processing_outputs.xlsx").then((res) => res.blob()),
    ]).then(
      async ([batchesBlob, materialsBlob, sourcesBlob, processingBlob]) => {
        const parseXLSX = async (blob: Blob): Promise<any[]> => {
          const arrayBuffer = await blob.arrayBuffer();
          const { read, utils } = await import("xlsx");
          const workbook = read(arrayBuffer, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          return utils.sheet_to_json(sheet, { defval: "" });
        };

        const [batchData, materials, sources, outputs] = await Promise.all([
          parseXLSX(batchesBlob),
          parseXLSX(materialsBlob),
          parseXLSX(sourcesBlob),
          parseXLSX(processingBlob),
        ]);

        const merged: EnrichedBatch[] = batchData.map((b: any) => {
          const mat = materials.find((m: any) => m.batchId === b.batchId) || {};
          const src = sources.find((s: any) => s.batchId === b.batchId) || {};
          const out = outputs.find((o: any) => o.batchId === b.batchId) || {};

          const rawDate =
            src.dateOfDispatchFromSource ||
            out.dateOfCategorization ||
            src.dateReceivedAtCollection;
          const parsedDate = rawDate ? parseISO(rawDate) : undefined;

          return {
            ...b,
            collectedQty: safeParse(
              src.collectedQty || src.collected_quantity || src.collected
            ),
            categorizedQty: safeParse(out.categorizedQty),
            yieldPercentage:
              safeParse(out.categorizedQty) && safeParse(src.collectedQty)
                ? (safeParse(out.categorizedQty) /
                    safeParse(src.collectedQty)) *
                  100
                : 0,
            ...mat,
            ...src,
            ...out,
            parsedDate,
          };
        });

        setParsedBatches(merged);
      }
    );
  }, []);

  const datesWithData = parsedBatches
    .map((b) => b.parsedDate)
    .filter(Boolean)
    .sort((a, b) => b!.getTime() - a!.getTime()) as Date[];

  useEffect(() => {
    if (!dateRange && datesWithData.length > 0) {
      const defaultRange = getDefaultRange(datesWithData);
      setDateRange(defaultRange);
    }
  }, [datesWithData, dateRange]);

  const filteredBatches = useMemo(() => {
    if (!dateRange) return [];
    return parsedBatches.filter(
      (b) =>
        b.parsedDate &&
        isWithinInterval(b.parsedDate, {
          start: dateRange.from,
          end: dateRange.to,
        })
    );
  }, [dateRange, parsedBatches]);

  const safeParse = (val: any): number => {
    if (typeof val === "string") {
      val = val.replace("%", "").trim();
    }
    return parseFloat(val) || 0;
  };

  const collectedList = filteredBatches.map((b) => safeParse(b.collectedQty));
  const rawList = filteredBatches.map((b) => safeParse(b.rawMaterialQty));

  const totalIn = collectedList.reduce((acc, val) => acc + val, 0);
  const forecastIn = rawList.reduce((acc, val) => acc + val, 0);
  const totalOut = filteredBatches.reduce((acc, b) => {
    return (
      acc + (safeParse(b.categorizedQty) * safeParse(b.yieldPercentage)) / 100
    );
  }, 0);
  const forecastOut = filteredBatches.reduce((acc, b) => {
    return (
      acc + (safeParse(b.rawMaterialQty) * safeParse(b.yieldPercentage)) / 100
    );
  }, 0);

  const yieldActual = totalIn ? (totalOut / totalIn) * 100 : 0;
  const yieldForecast = forecastIn ? (forecastOut / forecastIn) * 100 : 0;

  return (
    <AppLayout title="Material Flow Tracer">
      <div className="flex min-h-screen w-full bg-beige text-charcoal">
        <main className="flex-1 p-6 space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[250px] justify-start text-left font-normal"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} -{" "}
                      {format(dateRange.to, "LLL dd, yyyy")}
                    </>
                  ) : (
                    <span>Select a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range as DateRange)}
                  numberOfMonths={2}
                  disabled={(date) =>
                    !datesWithData.find(
                      (d) =>
                        format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-muted-foreground text-sm">Qty In</div>
                <div className="text-2xl font-bold text-primary">
                  {totalIn.toFixed(2)} T (A)
                </div>
                <div className="text-sm text-muted-foreground">
                  {forecastIn.toFixed(2)} T (F) (
                  {((totalIn / forecastIn) * 100 || 0).toFixed(1)}% accuracy)
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-muted-foreground text-sm">Qty Out</div>
                <div className="text-2xl font-bold text-primary">
                  {totalOut.toFixed(2)} T (A)
                </div>
                <div className="text-sm text-muted-foreground">
                  {forecastOut.toFixed(2)} T (F) (
                  {((totalOut / forecastOut) * 100 || 0).toFixed(1)}% accuracy)
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-muted-foreground text-sm">Yield %</div>
                <div className="text-2xl font-bold text-yellow">
                  {yieldActual.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {yieldForecast.toFixed(1)}% (F)
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-red">
              <CardContent className="py-4">
                <div className="text-muted-foreground text-sm">
                  Orders At Risk
                </div>
                <div className="text-2xl font-bold text-red">₹28.9K</div>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-lightgreen text-primary">
                <tr>
                  <th className="p-2">Batch ID</th>
                  <th className="p-2">Material Name</th>
                  <th className="p-2">Composition</th>
                  <th className="p-2">Supplier</th>
                  <th className="p-2">Raw M Qty (T)</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr
                    key={batch.batchId}
                    className="border-t hover:bg-muted/50"
                  >
                    <td className="p-2">{batch.batchId}</td>
                    <td className="p-2">{batch.materialName}</td>
                    <td className="p-2">{batch?.composition}</td>
                    <td className="p-2">{batch?.sourceName}</td>
                    <td className="p-2">
                      {safeParse(batch.rawMaterialQty).toFixed(2)} T
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DataTable data={filteredBatches} />

          <Card>
            <SankeyChart batches={filteredBatches} />
          </Card>
        </main>
      </div>
    </AppLayout>
  );
}
