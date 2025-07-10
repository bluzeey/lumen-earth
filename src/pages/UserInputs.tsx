import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/AppLayout";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";

const datasetKeys = [
  "batches",
  "materials",
  "sources",
  "processing_outputs",
  "orders",
  "inventory",
  "forecasts",
] as const;
type DatasetKey = (typeof datasetKeys)[number];

const datasetLabels: Record<DatasetKey, string> = {
  batches: "Batch Master",
  materials: "Materials",
  sources: "Sources",
  processing_outputs: "Processing Outputs",
  orders: "Orders",
  inventory: "Inventory",
  forecasts: "Forecasts",
};

const datasetPaths: Record<DatasetKey, string> = {
  batches: "/data/batches.xlsx",
  materials: "/data/materials.xlsx",
  sources: "/data/sources.xlsx",
  processing_outputs: "/data/processing_outputs.xlsx",
  orders: "/data/orders.xlsx",
  inventory: "/data/inventory.xlsx",
  forecasts: "/data/forecasts.xlsx",
};

const expectedColumns: Record<DatasetKey, string[]> = {
  batches: [
    "batchId",
    "parentBatch",
    "stage",
    "processingType",
    "yieldPercentage",
  ],
  materials: [
    "batchId",
    "materialName",
    "category",
    "type",
    "composition",
    "trfName",
  ],
  sources: [
    "batchId",
    "sourceCode",
    "sourceName",
    "dateOfDispatchFromSource",
    "dateReceivedAtCollection",
    "invoiceId",
    "paymentStatus",
  ],
  processing_outputs: [
    "batchId",
    "categorizedQty",
    "dateOfCategorization",
    "productItem",
    "contaminationCategory",
  ],
  orders: [
    "order_id",
    "sku",
    "order_quantity",
    "order_value",
    "region",
    "risk_status",
    "delivery_due_week",
    "delivery_due_date",
  ],
  inventory: [
    "inventory_id",
    "sku",
    "material_type",
    "region",
    "available_quantity",
    "unit",
    "expected_restock_date",
  ],
  forecasts: ["week", "sku", "projected_tonnage", "date"],
};

export default function ExcelDataEditor() {
  const [datasets, setDatasets] = useState<Record<DatasetKey, any[]>>(
    () =>
      Object.fromEntries(datasetKeys.map((k) => [k, []])) as unknown as Record<
        DatasetKey,
        any[]
      >
  );
  const [columns, setColumns] = useState<Record<DatasetKey, any[]>>(
    () =>
      Object.fromEntries(datasetKeys.map((k) => [k, []])) as unknown as Record<
        DatasetKey,
        any[]
      >
  );
  const [errors, setErrors] = useState<Record<DatasetKey, string>>(
    () =>
      Object.fromEntries(datasetKeys.map((k) => [k, ""])) as Record<
        DatasetKey,
        string
      >
  );
  const [openTable, setOpenTable] = useState<DatasetKey | null>(null);
  const [fileNames, setFileNames] = useState<Record<DatasetKey, string>>(
    () =>
      Object.fromEntries(
        datasetKeys.map((k) => [k, "(auto-loaded)"])
      ) as Record<DatasetKey, string>
  );

  const loadExcel = async (key: DatasetKey, file: File | Blob) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const expected = expectedColumns[key];
      const actual = json.length > 0 ? Object.keys(json[0] as object) : [];
      const missing = expected.filter((col) => !actual.includes(col));

      if (missing.length > 0) {
        setErrors((prev) => ({
          ...prev,
          [key]: `Missing columns: ${missing.join(", ")}`,
        }));
        return;
      }

      const cols = expected.map((col) => ({
        key: col,
        name: col,
        editable: true,
      }));
      setDatasets((prev) => ({ ...prev, [key]: json }));
      setColumns((prev) => ({ ...prev, [key]: cols }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
      setFileNames((prev) => ({
        ...prev,
        [key]: file instanceof File ? file.name : "(blob)",
      }));
    } catch (err: any) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        [key]: err.message || "Failed to load file",
      }));
    }
  };

  useEffect(() => {
    datasetKeys.forEach(async (key) => {
      try {
        const res = await fetch(datasetPaths[key]);
        if (!res.ok) throw new Error(`Failed to fetch ${key}`);
        const data = await res.arrayBuffer();
        const file = new File([data], `${key}.xlsx`);
        await loadExcel(key, file);
      } catch (err) {
        console.error(`Auto-load failed for ${key}:`, err);
      }
    });
  }, []);

  const exportExcel = (key: DatasetKey) => {
    const ws = XLSX.utils.json_to_sheet(datasets[key]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, datasetLabels[key]);
    XLSX.writeFile(wb, `${key}.xlsx`);
  };

  const handleGridChange = (key: DatasetKey) => (updatedRows: any[]) => {
    setDatasets((prev) => ({ ...prev, [key]: updatedRows }));
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-2xl font-bold">Excel Data Manager</h1>
        <p className="text-sm text-gray-700 leading-relaxed">
          You can upload and edit each dataset using the interface below. The
          application loads structured Excel files (
          <code className="bg-muted px-1 rounded text-xs">.xlsx</code>) for
          entities like batches, materials, sources, inventory, and forecasts.
          Each file is validated to ensure it contains the required columns, and
          is presented in an interactive, spreadsheet-like editor. You can make
          inline edits directly in the dialog. Once you're done, export the data
          back as an Excel file — preserving the exact format and column
          structure needed by the system. This ensures smooth data exchange
          between your workflow and the Lumen platform.
        </p>

        {datasetKeys.map((key) => (
          <div key={key} className="space-y-4 border p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{datasetLabels[key]}</h2>
              <p className="text-sm text-gray-500 italic">
                Current file:{" "}
                <span className="font-mono text-blue-600">
                  {fileNames[key]}
                </span>
              </p>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) loadExcel(key, file);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => exportExcel(key)}
                  disabled={datasets[key].length === 0 || errors[key] !== ""}
                >
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpenTable(key)}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
                    <h3 className="text-lg font-semibold mb-2">
                      {datasetLabels[key]} Table
                    </h3>

                    {errors[key] && (
                      <p className="text-red-500 text-sm mb-2">{errors[key]}</p>
                    )}
                    {openTable === key &&
                      datasets[key].length > 0 &&
                      columns[key].length > 0 && (
                        <DataGrid
                          className="rdg-light"
                          rowHeight={35}
                          columns={columns[key]}
                          rows={datasets[key]}
                          onRowsChange={handleGridChange(key)}
                        />
                      )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
