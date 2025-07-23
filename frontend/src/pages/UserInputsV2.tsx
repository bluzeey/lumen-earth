import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Separator } from "src/components/ui/separator";
import AppLayout from "src/layouts/AppLayout";
import { Dialog, DialogContent, DialogTrigger } from "src/components/ui/dialog";
import { DataGrid, type Column } from "react-data-grid";
import "react-data-grid/lib/styles.css";

const TAB_CONFIGS = {
  collection: {
    file: "/data/batches.xlsx",
    expected: [
      "batchId",
      "parentBatch",
      "stage",
      "processingType",
      "yieldPercentage",
    ],
  },
  categorization: {
    file: "/data/categorization.xlsx",
    expected: ["category", "materialType", "composition", "grade"],
  },
  recycling: {
    file: "/data/recycling.xlsx",
    expected: ["recyclingType", "weight", "reused", "atRisk"],
  },
};

type TabKey = keyof typeof TAB_CONFIGS;

export default function UserInputsPage() {
  const insights = [
    {
      label: "Collection",
      score: 7,
      color: "border-yellow-500",
      description:
        "Key inputs on raw material supply by institutional providers",
    },
    {
      label: "Environmental Protection",
      score: 7,
      color: "border-yellow-500",
      description: "KPIs on Energy, Water, Air, Waste and chemical emissions",
    },
    {
      label: "Categorization",
      score: 8,
      color: "border-red-500",
      description: "Key batching, sorting and composition metric tracking",
    },
    {
      label: "Responsible Consumer Engagement",
      score: 9,
      color: "border-green-600",
      description: "KPIs on consumer complaints, feedback, data privacy",
    },
    {
      label: "Recycling",
      score: 8,
      color: "border-green-600",
      description: "Recycling metrics including yield, buffer, at-risk demand",
    },
    {
      label: "Human Rights & Employee Wellbeing",
      score: 9,
      color: "border-green-600",
      description: "Fair wages, benefits, accessibility, unionization",
    },
  ];

  const [activeTab, setActiveTab] = useState<TabKey>("collection");
  const [dataset, setDataset] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column<any>[]>([]);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState("(auto-loaded)");
  const [openTable, setOpenTable] = useState(false);

  const loadExcel = async (file: File | Blob, tabKey: TabKey) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
        defval: "",
      });

      const expected = TAB_CONFIGS[tabKey].expected;
      const actual = json.length > 0 ? Object.keys(json[0]) : [];
      const missing = expected.filter((col: string) => !actual.includes(col));

      if (missing.length > 0) {
        setError(`Missing columns: ${missing.join(", ")}`);
        return;
      }

      setColumns(
        expected.map((col: string) => ({ key: col, name: col, editable: true }))
      );
      setDataset(json);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load file");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataset);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${activeTab}.xlsx`);
  };

  useEffect(() => {
    const config = TAB_CONFIGS[activeTab];
    fetch(config.file)
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const file = new File([data], `${activeTab}.xlsx`);
        setFileName("(auto-loaded)");
        loadExcel(file, activeTab);
      })
      .catch((err) => console.error("Failed to auto-load", err));
  }, [activeTab]);

  return (
    <AppLayout title="User Inputs">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((item, i) => (
            <Card key={i} className="border bg-white">
              <CardHeader>
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <div
                    className={`rounded-full border-4 ${item.color} w-12 h-12 flex items-center justify-center text-sm font-bold`}
                  >
                    {item.score}/10
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <Tabs
          defaultValue="collection"
          className="w-full"
          onValueChange={(val) => setActiveTab(val as TabKey)}
        >
          <TabsList>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="categorization">Categorization</TabsTrigger>
            <TabsTrigger value="recycling">Recycling</TabsTrigger>
          </TabsList>

          {Object.keys(TAB_CONFIGS).map((tab) => (
            <TabsContent key={tab} value={tab} className="pt-4 space-y-4">
              <h3 className="text-lg font-semibold">
                Manual Inputs & Excel Table
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-white p-4 rounded-md">
                  <Label>Batch ID</Label>
                  <Input placeholder="XA00024" />
                  <Label>Material Type</Label>
                  <Input placeholder="Cotton / Polyester" />
                  <Label>Weight (Kg)</Label>
                  <Input placeholder="Enter weight" />
                  <Label>Quality Grade</Label>
                  <Input placeholder="Grade A / B / C" />
                  <Button className="mt-4">Submit</Button>
                  <div className="text-sm text-muted-foreground mt-4">
                    Updates by: <strong>User ABC</strong>
                    <br />
                    Ledger ID: <code>#ASD128OKFJASJAH324529</code>
                    <br />
                    Date: <strong>June 11 2025</strong>
                  </div>
                </div>

                <div className="space-y-2 bg-white p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{tab} Table</h4>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFileName(file.name);
                            loadExcel(file, tab as TabKey);
                          }
                        }}
                      />
                      <Button onClick={exportExcel} variant="outline">
                        Export
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setOpenTable(true)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl">
                          <h3 className="text-lg font-semibold mb-2">
                            {tab} Table (Full)
                          </h3>
                          {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                          )}
                          {openTable &&
                            dataset.length > 0 &&
                            columns.length > 0 && (
                              <DataGrid
                                className="rdg-light"
                                rowHeight={35}
                                columns={columns}
                                rows={dataset}
                                onRowsChange={(rows) => setDataset(rows)}
                              />
                            )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                  )}
                  {dataset.length > 0 && columns.length > 0 ? (
                    <DataGrid
                      className="rdg-light"
                      rowHeight={35}
                      columns={columns}
                      rows={dataset}
                      onRowsChange={(rows) => setDataset(rows)}
                    />
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      No data loaded.
                    </p>
                  )}
                  <p className="text-xs mt-1 text-muted-foreground font-mono">
                    File: {fileName}
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
