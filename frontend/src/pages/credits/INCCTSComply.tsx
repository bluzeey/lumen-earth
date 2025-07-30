import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout";

const checklist = [
  { item: "Organization registered on INCCTS", done: true },
  { item: "Baseline data submitted", done: true },
  { item: "Material tracing enabled", done: false },
  { item: "Third‑party audit completed", done: false },
  { item: "Verification report issued", done: false },
];

export default function INCCTSComplyPage() {
  return (
    <AppLayout title="INCCTS Comply">
      <div className="max-w-3xl mx-auto space-y-6 py-10">
        <h1 className="text-2xl font-semibold">Compliance Overview</h1>
        <Card>
          <CardHeader>
            <CardTitle>Requirements Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((c) => (
              <div key={c.item} className="flex items-center gap-2 text-sm">
                <span className={c.done ? "text-green-600" : "text-red-600"}>
                  {c.done ? "✓" : "✗"}
                </span>
                <span>{c.item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submit Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-1">
                <Label>Upload Compliance Document</Label>
                <Input type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
              </div>
              <Button type="submit">Upload</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
