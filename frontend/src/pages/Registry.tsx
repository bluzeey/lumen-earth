import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import AppLayout from "@/layouts/AppLayout";
import registryData from "@/data/registry.json";

interface RegistryEntry {
  name: string;
  owner: string;
  impact: string;
  creditPrice: string;
  gciRegistration: string;
}

export default function RegistryPage() {
  const data = registryData as RegistryEntry[];
  return (
    <AppLayout title="Registry">
      <div className="max-w-6xl mx-auto py-10 space-y-6 text-charcoal">
        <h1 className="text-2xl font-semibold">Lumen Green Credit Insets Registry</h1>
        <div className="rounded-xl shadow-md border overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-charcoal text-white z-10">
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Owner</TableHead>
                <TableHead className="text-white">Impact</TableHead>
                <TableHead className="text-white">Credit Price</TableHead>
                <TableHead className="text-white">GCI Registration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.gciRegistration} className="even:bg-beige">
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.impact}</TableCell>
                  <TableCell>{row.creditPrice}</TableCell>
                  <TableCell>{row.gciRegistration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
