import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout";

const projects = [
  { name: "Biomass Boiler Upgrade", region: "Karnataka", price: "₹500/tCO₂e" },
  { name: "Solar Thermal Installation", region: "Tamil Nadu", price: "₹650/tCO₂e" },
];

export default function INCCTSOffsetPage() {
  return (
    <AppLayout title="INCCTS Offset">
      <div className="max-w-4xl mx-auto space-y-6 py-10">
        <h1 className="text-2xl font-semibold">Carbon Offset Marketplace</h1>
        <Card>
          <CardHeader>
            <CardTitle>Purchase Offsets</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity (tCO₂e)</Label>
                <Input id="quantity" type="number" placeholder="e.g. 10" />
              </div>
              <Button type="submit">Calculate Price</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Projects</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.region}</TableCell>
                    <TableCell>{p.price}</TableCell>
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
