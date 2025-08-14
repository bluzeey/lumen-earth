import { useMemo, useState, useEffect } from "react";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ArrowRightLeft,
} from "lucide-react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

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
import { Badge } from "@/components/ui/badge";

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

  console.log(filteredBatches);

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

  const getDeviationColor = (actual: number, forecast: number) => {
    if (!forecast) return "text-gray-500";
    const deviation = Math.abs(actual - forecast) / forecast;
    if (deviation <= 0.2) {
      const greens = [
        "text-green-500",
        "text-green-400",
        "text-green-300",
        "text-green-200",
        "text-green-100",
      ];
      const index = Math.min(
        greens.length - 1,
        Math.floor((deviation / 0.2) * (greens.length - 1))
      );
      return greens[index];
    }
    const reds = [
      "text-red-100",
      "text-red-200",
      "text-red-300",
      "text-red-400",
      "text-red-500",
    ];
    const index = Math.min(
      reds.length - 1,
      Math.floor(((deviation - 0.2) / 0.8) * (reds.length - 1))
    );
    return reds[index];
  };

  const getYieldColor = (value: number) => {
    const colors = [
      "text-red-500",
      "text-red-400",
      "text-red-300",
      "text-red-200",
      "text-red-100",
      "text-green-100",
      "text-green-200",
      "text-green-300",
      "text-green-400",
      "text-green-500",
    ];
    const index = Math.min(
      colors.length - 1,
      Math.floor((value / 100) * (colors.length - 1))
    );
    return colors[index];
  };

  const getRiskColor = (risk: number) =>
    risk > 0 ? "text-red-500" : "text-green-500";

  const ordersAtRisk = 28900;

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
                    "w-[250px] justify-start text-left font-normal bg-white"
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

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
  <Card>
    <CardHeader>
      <CardDescription>Qty In</CardDescription>
      <CardTitle
        className={cn(
          "text-3xl font-semibold tabular-nums",
          getDeviationColor(totalIn, forecastIn)
        )}
      >
        {totalIn.toFixed(2)} T
      </CardTitle>
      <CardAction>
        <Badge
          variant="outline"
          className={cn(
            ((totalIn / forecastIn) * 100 || 0) >= 100
              ? "text-green-600"
              : "text-red-600"
          )}
        >
          {((totalIn / forecastIn) * 100 || 0) >= 100 ? (
            <IconTrendingUp />
          ) : (
            <IconTrendingDown />
          )}
          {((totalIn / forecastIn) * 100 - 100 || 0).toFixed(1)}%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        {((totalIn / forecastIn) * 100 || 0) >= 100
          ? "Above forecast"
          : "Below forecast"}
      </div>
      <div className="text-muted-foreground">
        Forecast: {forecastIn.toFixed(2)} T
      </div>
    </CardFooter>
  </Card>

  <Card>
    <CardHeader>
      <CardDescription>Qty Out</CardDescription>
      <CardTitle
        className={cn(
          "text-3xl font-semibold tabular-nums",
          getDeviationColor(totalOut, forecastOut)
        )}
      >
        {totalOut.toFixed(2)} T
      </CardTitle>
      <CardAction>
        <Badge
          variant="outline"
          className={cn(
            ((totalOut / forecastOut) * 100 || 0) >= 100
              ? "text-green-600"
              : "text-red-600"
          )}
        >
          {((totalOut / forecastOut) * 100 || 0) >= 100 ? (
            <IconTrendingUp />
          ) : (
            <IconTrendingDown />
          )}
          {((totalOut / forecastOut) * 100 - 100 || 0).toFixed(1)}%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        {((totalOut / forecastOut) * 100 || 0) >= 100
          ? "Above forecast"
          : "Below forecast"}
      </div>
      <div className="text-muted-foreground">
        Forecast: {forecastOut.toFixed(2)} T
      </div>
    </CardFooter>
  </Card>

  <Card>
    <CardHeader>
      <CardDescription>Yield %</CardDescription>
      <CardTitle
        className={cn(
          "text-3xl font-semibold tabular-nums",
          getYieldColor(yieldActual)
        )}
      >
        {yieldActual.toFixed(1)}%
      </CardTitle>
      <CardAction>
        <Badge
          variant="outline"
          className={cn(
            yieldActual >= yieldForecast ? "text-green-600" : "text-red-600"
          )}
        >
          {yieldActual >= yieldForecast ? (
            <IconTrendingUp />
          ) : (
            <IconTrendingDown />
          )}
          {(yieldActual - yieldForecast).toFixed(1)}%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        {yieldActual >= yieldForecast ? "Above forecast" : "Below forecast"}
      </div>
      <div className="text-muted-foreground">
        Forecast: {yieldForecast.toFixed(1)}%
      </div>
    </CardFooter>
  </Card>

  <Card className="border-2">
    <CardHeader>
      <CardDescription>Orders At Risk</CardDescription>
      <CardTitle
        className={cn(
          "text-3xl font-semibold tabular-nums",
          getRiskColor(ordersAtRisk)
        )}
      >
        ₹{(ordersAtRisk / 1000).toFixed(1)}K
      </CardTitle>
      <CardAction>
        <Badge variant="outline" className="text-red-600">
          <ArrowRightLeft className="size-4" /> 0%
        </Badge>
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">Stable risk</div>
      <div className="text-muted-foreground">Monitor closely</div>
    </CardFooter>
  </Card>
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
