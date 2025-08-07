import { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setChartData(metrics.donutChartData);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AppLayout title="Green Certification & Finance">
      <div className="p-4 sm:p-6 text-charcoal">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-8 px-2">
          <Card className="@container/card my-auto">
            <CardHeader>
              <CardDescription>Green Premium Actualized</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-red-600 @[250px]/card:text-3xl">
                ₹1.7L
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 font-medium">
                Revenue from Green Premiums
              </div>
              <div className="text-muted-foreground">
                EPR certificates included
              </div>
            </CardFooter>
          </Card>

          <Card className="h-full w-full bg-transparent shadow-none border-transparent flex items-center justify-center">
            <div className="w-full h-64 relative">
              {chartData && (
                <ResponsivePie
                  data={chartData}
                  innerRadius={0.6}
                  margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                  colors={(d) => d.data.color as string}
                  enableArcLinkLabels={true}
                  arcLabelsTextColor="#333333"
                  animate={true}
                  motionConfig="wobbly"
                />
              )}
            </div>
          </Card>

          <Card className="@container/card mt-8 my-auto">
            <CardHeader>
              <CardDescription>Green Premium Potential</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-green-700 @[250px]/card:text-3xl">
                ₹20.3L
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 font-medium">
                Institutional input opportunity
              </div>
              <div className="text-muted-foreground">
                Raw material source value
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Green Certifications</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-purple-700 @[250px]/card:text-3xl">
                1 / 4
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 font-medium">
                GRS active vs possible
              </div>
              <div className="text-muted-foreground">
                Green Recycling Standard
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Qualifying Product Count</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-blue-600 @[250px]/card:text-3xl">
                2 / 4
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 font-medium">
                Above PCF material baseline
              </div>
              <div className="text-muted-foreground">
                Certified product count
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Green Inset Projects</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-blue-600 @[250px]/card:text-3xl">
                4
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 font-medium">
                Fundable initiatives
              </div>
              <div className="text-muted-foreground">
                Climate-linked infrastructure
              </div>
            </CardFooter>
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
