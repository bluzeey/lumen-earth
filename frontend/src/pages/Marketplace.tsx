import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/AppLayout";
import suppliers from "@/data/suppliers.json";

interface Supplier {
  id: number;
  name: string;
  material: string;
  ratePerTonne: number;
  location: string;
}

export default function Marketplace() {
  const data = suppliers as Supplier[];
  return (
    <AppLayout title="Marketplace">
      <div className="max-w-4xl mx-auto py-10 space-y-6">
        <h1 className="text-2xl font-semibold">Supplier Marketplace</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Rate/Tonne (₹)</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.material}</TableCell>
                <TableCell>{s.ratePerTonne}</TableCell>
                <TableCell>{s.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
