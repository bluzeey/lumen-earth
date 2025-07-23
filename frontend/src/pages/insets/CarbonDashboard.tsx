import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "src/components/ui/table";
import AppLayout from "src/layouts/AppLayout";

const summary = {
  totalGHG: 4825.7, // tonnes
  virginDisplaced: 3200, // tonnes
  energySaved: 910000, // kWh
  creditsMonetized: 7452500, // ₹
};

const ghgOverTime = [
  { month: "Jan", ghg: 300 },
  { month: "Feb", ghg: 420 },
  { month: "Mar", ghg: 510 },
  { month: "Apr", ghg: 615 },
  { month: "May", ghg: 730 },
  { month: "Jun", ghg: 900 },
];

const recentProjects = [
  {
    name: "PET Recycling 2024A",
    material: "PET Plastic",
    ghg: 520,
    status: "Verified",
  },
  {
    name: "Cotton Reuse Pilot",
    material: "Cotton",
    ghg: 310,
    status: "Draft",
  },
  {
    name: "Aluminum Loop",
    material: "Aluminum",
    ghg: 850,
    status: "Sold",
  },
  {
    name: "Closed Loop Steel",
    material: "Steel",
    ghg: 670,
    status: "Verified",
  },
  {
    name: "Hospital Textile Pilot",
    material: "Mixed",
    ghg: 420,
    status: "Pending",
  },
];

export default function CarbonDashboardPage() {
  return (
    <AppLayout title="Carbon Dashboard">
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Carbon Impact Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total GHG Avoided</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-green-600">
              {summary.totalGHG.toLocaleString()} tCO₂e
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Virgin Material Displaced</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.virginDisplaced.toLocaleString()} tonnes
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Energy Saved</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.energySaved.toLocaleString()} kWh
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Credits Monetized</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-emerald-700">
              ₹{summary.creditsMonetized.toLocaleString()}
            </CardContent>
          </Card>
        </div>

        {/* GHG Chart */}
        <Card>
          <CardHeader>
            <CardTitle>GHG Saved Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ghgOverTime}>
                <XAxis dataKey="month" />
                <YAxis unit="t" />
                <Tooltip />
                <Bar dataKey="ghg" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>GHG Saved</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map((project) => (
                  <TableRow key={project.name}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.material}</TableCell>
                    <TableCell>{project.ghg} tCO₂e</TableCell>
                    <TableCell>{project.status}</TableCell>
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
