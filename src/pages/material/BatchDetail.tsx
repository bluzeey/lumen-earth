import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { format } from "date-fns";
import { AddInventoryLogDialog } from "@/components/material/InventoryLogDialog"; // <-- import your dialog component
import AppLayout from "@/layouts/AppLayout";

// Dummy API mocks
const fetchBatchById = async (id: string) => {
  return {
    id,
    source: "Factory",
    material: "Cotton",
    weight: 1000,
    date: new Date(),
    composition: "80% Cotton, 20% Recycled Fiber",
    documents: [
      { name: "invoice.pdf", url: "/files/invoice.pdf" },
      { name: "image.jpg", url: "/files/image.jpg" },
    ],
    status: "complete",
    completenessScore: 7,
    flags: ["Missing COA", "Manual weight override"],
    inventoryLogs: [
      { date: new Date(), input: 500, output: 450 },
      { date: new Date(), input: 500, output: 480 },
    ],
  };
};

function computeMetrics(input: number, output: number) {
  const yieldPct = ((output / input) * 100).toFixed(1);
  const lossPct = (100 - parseFloat(yieldPct)).toFixed(1);
  return { yieldPct, lossPct };
}

export default function BatchDetailsPage() {
  const { batchId } = useParams({ from: "/app/material/$batchId" }) as {
    batchId: string;
  };
  const [batch, setBatch] = useState<any>(null);

  useEffect(() => {
    fetchBatchById(batchId).then(setBatch);
  }, [batchId]);

  if (!batch) return <p className="p-6">Loading...</p>;

  return (
    <AppLayout>
      <div className="flex max-w-7xl mx-auto px-4 py-10 gap-8">
        {/* Main Section */}
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-semibold">Batch #{batch.id}</h1>

          {/* Batch Info Card */}
          <Card>
            <CardHeader>
              Status: <span className="capitalize">{batch.status}</span>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Source:</strong> {batch.source}
              </p>
              <p>
                <strong>Material:</strong> {batch.material}
              </p>
              <p>
                <strong>Weight:</strong> {batch.weight} kg
              </p>
              <p>
                <strong>Date:</strong> {format(new Date(batch.date), "PPP")}
              </p>
              <p>
                <strong>Composition:</strong> {batch.composition}
              </p>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>Documents</CardHeader>
            <CardContent className="space-y-2">
              {batch.documents.map((doc: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{doc.name}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <FileDown className="h-4 w-4 mr-1" /> Download
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Inventory Log */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <span>Inventory Log</span>
              <AddInventoryLogDialog
                onAdd={(log) => {
                  setBatch((prev: any) => ({
                    ...prev,
                    inventoryLogs: [
                      ...prev.inventoryLogs,
                      {
                        date: log.date,
                        input: log.input,
                        output: log.output,
                        note: log.note,
                      },
                    ],
                  }));
                }}
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Input (kg)</TableHead>
                    <TableHead>Output (kg)</TableHead>
                    <TableHead>Yield %</TableHead>
                    <TableHead>Loss %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batch.inventoryLogs.map((log: any, i: number) => {
                    const { yieldPct, lossPct } = computeMetrics(
                      log.input,
                      log.output
                    );
                    return (
                      <TableRow key={i}>
                        <TableCell>{format(log.date, "PPP")}</TableCell>
                        <TableCell>{log.input}</TableCell>
                        <TableCell>{log.output}</TableCell>
                        <TableCell>{yieldPct}%</TableCell>
                        <TableCell>{lossPct}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="w-72 space-y-6">
          <Card>
            <CardHeader>Data Completeness</CardHeader>
            <CardContent>
              <Progress value={(batch.completenessScore / 10) * 100} />
              <p className="mt-2 text-sm">{batch.completenessScore}/10</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Flags</CardHeader>
            <CardContent className="space-y-2">
              {batch.flags.length > 0 ? (
                batch.flags.map((flag: string, i: number) => (
                  <p key={i} className="text-red-600 text-sm">
                    ⚠ {flag}
                  </p>
                ))
              ) : (
                <p className="text-green-600 text-sm">No flags</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
}
