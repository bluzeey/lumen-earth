import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/AppLayout";

const certifications = [
  { name: "GOTS", focus: "Organic fibres" },
  { name: "GRS", focus: "Recycled materials" },
  { name: "Oeko-Tex", focus: "Chemical safety" },
  { name: "Fair Trade", focus: "Ethical sourcing" },
];

export default function GreenCertifications() {
  return (
    <AppLayout title="Green Certifications">
      <div className="max-w-4xl mx-auto space-y-6 py-10">
        <h1 className="text-2xl font-semibold">Recognized Programs</h1>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Lumen Earth tracks sustainability credentials associated with textile materials.
              Certifications help verify recycled content, chemical management and social compliance.
            </p>
            <p>
              Below are common certifications supported on the platform. Additional programs can be added on request.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Focus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.focus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
