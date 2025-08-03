import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import AppLayout from "@/layouts/AppLayout";
import { ArrowUpRight } from "lucide-react";
import { ResponsivePie } from "@nivo/pie";

const metrics = {
  greenPremiumActualized: 170000,
  greenPremiumPotential: 2030000,
  greenCertifications: {
    current: 1,
    potential: 4,
  },
  greenInsetProjects: 4,
  qualifyingProductCount: {
    current: 2,
    total: 4,
  },
  donutChartData: [
    { id: "Landfill Diversion", value: 30, color: "#204936" },
    { id: "Virgin Material Avoided", value: 25, color: "#82A665" },
    { id: "Energy Recovered", value: 20, color: "#D2E69A" },
    { id: "Clean Water Pollution Avoided", value: 15, color: "#FDCC6F" },
    { id: "Incinerated Air Avoided", value: 10, color: "#FFEABB" },
  ],
};

const premiumSuggestions = [
  "Data Quality Improvement for Collection",
  "Data Quality Improvement for Collection Categorization",
  "Green certification application for 60-40% Cotton Poly blends",
  "Supplier engagement for traceable inputs",
  "Digital tracking setup for water & energy usage",
];

const greenInsetsRegistry = [
  {
    name: "Waste water management plant",
    owner: "Second Spin",
    impact: "3 tonnes water/month",
    creditPrice: "₹8.2L / 5 years",
    gciRegistration: "@DSA1280KFJASJA#1109274",
  },
  {
    name: "ZLD plant",
    owner: "Green worms",
    impact: "2 tonnes water/month",
    creditPrice: "₹8.2L / 5 years",
    gciRegistration: "@WSA1280KFJASJA#1512408",
  },
  {
    name: "Material composition detection",
    owner: "Sahas",
    impact: "1.2T Carbon/month",
    creditPrice: "₹8.2L / 5 years",
    gciRegistration: "@VFG1280KFJASJA#1760921",
  },
  {
    name: "ZLD plant",
    owner: "Sahas",
    impact: "1.5 tonnes water/month",
    creditPrice: "₹8.2L / 5 years",
    gciRegistration: "@IUER1280KFJASJA#1123983",
  },
  {
    name: "Self Solar Powered facility",
    owner: "Second Spin",
    impact: "500 kg Carbon/month",
    creditPrice: "₹8.2L / 5 years",
    gciRegistration: "@PO11280KFJASJA#708341",
  },
  {
    name: "Chemical cleaning plant",
    owner: "Green worms",
    impact: "1 tonnes water/month",
    creditPrice: "₹8.2L / 5 years",
    gciRegistration: "@YUJ1280KFJASJA#908123",
  },
];

export default function FinancializationPage() {
  return (
    <AppLayout title="Green Certification & Finance">
      <div className="p-4 sm:p-6 text-charcoal">
        {/* Centralized Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-x-8 gap-y-12 items-center justify-center my-8">
          {/* Top row */}
          <Card className="p-4 bg-white border rounded-xl shadow-sm md:row-start-1 md:col-start-1 text-center">
            <CardTitle className="text-sm font-semibold">
              Green Premium Actualized
            </CardTitle>
            <CardContent className="text-2xl font-bold text-red-600">
              ₹1.7L
            </CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              Added revenues from Green premiums, EPR certificates
            </p>
          </Card>

          <Card className="p-4 bg-white border rounded-xl shadow-sm md:row-start-2 md:col-start-2 text-center">
            <CardTitle className="text-sm font-semibold">
              Green Certifications
            </CardTitle>
            <CardContent className="text-2xl font-bold text-purple-700">
              1 / 4
            </CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              Active Green Recycling Standard Certificates present vs potential
            </p>
          </Card>

          <Card className="p-4 bg-white border rounded-xl shadow-sm md:row-start-1 md:col-start-3 text-center">
            <CardTitle className="text-sm font-semibold">
              Green Premium Potential
            </CardTitle>
            <CardContent className="text-2xl font-bold text-green-700">
              ₹20.3L
            </CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              Key inputs on raw material supply by Institutional providers
            </p>
          </Card>

          {/* Middle row */}
          <Card className="p-4 bg-white border rounded-xl shadow-sm md:row-start-2 md:col-start-1 text-center">
            <CardTitle className="text-sm font-semibold">
              Green Insets Qualifying Product Count
            </CardTitle>
            <CardContent className="text-2xl font-bold text-blue-600">
              2 / 4
            </CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              Products verifiably performing better than baseline material PCF
              metrics
            </p>
          </Card>

          {/* Donut chart in center */}
          {/* Donut chart in center with space for legend */}
          <div className="md:row-start-1 md:col-start-2 flex justify-center items-center h-full w-full">
            <div className="w-2/5 h-2/5 absolute">
              <ResponsivePie
                data={metrics.donutChartData}
                innerRadius={0.6}
                margin={{ top: 80, right: 80, bottom: 80, left: 80 }} // leave bottom space for legend
                colors={(d) => d.data.color as string}
                enableArcLinkLabels={true}
              />
            </div>
          </div>

          <Card className="p-4 bg-white border rounded-xl shadow-sm md:row-start-2 md:col-start-3 text-center">
            <CardTitle className="text-sm font-semibold">
              Green Inset Projects
            </CardTitle>
            <CardContent className="text-2xl font-bold text-blue-600">
              4
            </CardContent>
            <p className="text-xs text-muted-foreground mt-1">
              Total number of Green Inset Projects set up that are possible to
              fund
            </p>
          </Card>
        </div>

        {/* Suggestions and Registry */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-x-8 mt-8">
          <div className="space-y-2 lg:w-1/3 overflow-y-auto pr-2">
            <h2 className="text-lg font-semibold sticky top-0 bg-[#f9f9f6] z-10 py-2">
              Premium Potential Suggestions
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {premiumSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="flex items-start gap-2 bg-white rounded-xl shadow-md border p-4 hover:bg-gray-50"
                >
                  <ArrowUpRight className="text-leaf mt-1" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Registry Table */}
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            <h2 className="text-lg font-semibold sticky top-0 bg-[#f9f9f6] z-10 py-2">
              Lumen Green Credit Insets Registry
            </h2>
            <div className="rounded-xl shadow-md border min-w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-[#204936] text-white z-10">
                  <TableRow>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Owner</TableHead>
                    <TableHead className="text-white">Impact</TableHead>
                    <TableHead className="text-white">Credit Price</TableHead>
                    <TableHead className="text-white">
                      GCI Registration
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {greenInsetsRegistry.map((row) => (
                    <TableRow key={row.gciRegistration} className="bg-white">
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
        </div>
      </div>
    </AppLayout>
  );
}
