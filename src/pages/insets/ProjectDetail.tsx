import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import AppLayout from "@/layouts/AppLayout";

// Dummy data — replace with API
const fetchInsetProject = async (projectId: string) => ({
  id: projectId,
  name: "PET Recycling – Gujarat",
  material: "PET",
  owner: "Recyco Pvt Ltd",
  ghgAvoided: 1245.67,
  virginDisplacement: "850 kg",
  methodology: `### Calculation Methodology

Credits are estimated using the baseline vs project scenario lifecycle emissions.

Factors:
- Baseline: Virgin PET production (2.1 tCO₂e/ton)
- Project: Recycled PET (0.45 tCO₂e/ton)

Delta applied to throughput of 600 tons.

See [LCA Reference](https://example.com/lca.pdf) for details.`,
  status: "Verified",
  credits: {
    generated: 1200,
    claimed: 900,
    pipeline: 300,
  },
  documents: [
    { name: "audit-report.pdf", url: "/docs/audit-report.pdf" },
    { name: "lca-reference.pdf", url: "/docs/lca-reference.pdf" },
  ],
  checklist: {
    "Third-party audit complete": true,
    "LCA provided": true,
    "Ownership verified": true,
    "Revenue share defined": false,
    "Unique serial IDs assigned": false,
  },
});

export default function InsetProjectDetailsPage() {
  const { projectId } = useParams({ from: "/app/insets/$projectId" }) as {
    projectId: string;
  };

  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    fetchInsetProject(projectId).then(setProject);
  }, [projectId]);

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <AppLayout>
      <div className="flex max-w-7xl mx-auto gap-6 px-4 py-10">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">{project.name}</h1>
              <p className="text-muted-foreground text-sm">
                {project.material} • Owned by {project.owner}
              </p>
            </div>
            <Badge variant="outline" className="text-sm capitalize">
              {project.status}
            </Badge>
          </div>

          {/* GHG + Virgin Displacement */}
          <Card>
            <CardHeader>Impact Summary</CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium">GHG Avoided</p>
                <p className="text-lg font-bold">
                  {project.ghgAvoided} tonnes CO₂e
                </p>
              </div>
              <div>
                <p className="font-medium">Virgin Material Displacement</p>
                <p className="text-lg font-bold">
                  {project.virginDisplacement}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card>
            <CardHeader>Calculation Methodology</CardHeader>
            <CardContent>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    project.methodology && project.methodology.startsWith("###")
                      ? markdownToHtml(project.methodology)
                      : project.methodology,
                }}
              />
            </CardContent>
          </Card>

          {/* Credit Breakdown */}
          <Card>
            <CardHeader>Credits Breakdown</CardHeader>
            <CardContent className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-medium">Generated</p>
                <p className="text-lg font-bold">{project.credits.generated}</p>
              </div>
              <div>
                <p className="font-medium">Claimed</p>
                <p className="text-lg font-bold">{project.credits.claimed}</p>
              </div>
              <div>
                <p className="font-medium">In Pipeline</p>
                <p className="text-lg font-bold">{project.credits.pipeline}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Upload */}
          <Card>
            <CardHeader>Documentation</CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {project.documents.map((doc: any, i: number) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{doc.name}</span>
                    <a
                      href={doc.url}
                      target="_blank"
                      className="text-blue-600 underline text-sm"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>

              <Separator />

              <form className="space-y-2">
                <Label>Upload Supporting Document</Label>
                <Input type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
                <Button type="submit" size="sm">
                  Upload
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="w-72 space-y-6">
          <Card>
            <CardHeader>Eligibility Checklist</CardHeader>
            <CardContent className="space-y-2 text-sm">
              {Object.entries(project.checklist).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={value ? "text-green-600" : "text-red-600"}>
                    {value ? "✓" : "✗"}
                  </span>
                  <span>{key}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
}

// Util: naive markdown → HTML (replace with real lib if needed)
function markdownToHtml(md: string) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      `<a href="$2" target="_blank">$1</a>`
    )
    .replace(/\n/g, "<br>");
}
