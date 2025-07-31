import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout";

interface Transaction {
  id: string;
  date: string;
  quantity: string;
  type: string;
}

const transactions: Transaction[] = [
  { id: "TX-101", date: "2024-05-10", quantity: "500 kg", type: "Issued" },
  { id: "TX-102", date: "2024-05-18", quantity: "300 kg", type: "Redeemed" },
  { id: "TX-103", date: "2024-06-02", quantity: "200 kg", type: "Issued" },
];

export default function GRSCreditsPage() {
  return (
    <AppLayout title="GRS Credits">
      <div className="max-w-4xl mx-auto space-y-6 py-10">
        <h1 className="text-2xl font-semibold">Global Recycled Standard Credits</h1>
        <Card>
          <CardHeader>
            <CardTitle>Credit Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-700">1,250 kg</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Record New Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" placeholder="e.g. 100" />
              </div>
              <div>
                <Label htmlFor="batch">Batch ID</Label>
                <Input id="batch" placeholder="Batch reference" />
              </div>
              <Button type="submit">Add Credits</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.quantity}</TableCell>
                    <TableCell>{t.type}</TableCell>
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
