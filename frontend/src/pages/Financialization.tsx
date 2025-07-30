import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    { id: "Landfill Diversion", value: 30, color: "#005A32" },
    { id: "Virgin Material Avoided", value: 25, color: "#238B45" },
    { id: "Energy Recovered", value: 20, color: "#41AE76" },
    { id: "Clean Water Pollution Avoided", value: 15, color: "#66C2A4" },
    { id: "Incinerated Air Avoided", value: 10, color: "#99D8C9" },
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
      <div className="p-6 text-charcoal space-y-6">
        <Tabs defaultValue="certification" className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="certification">Certification</TabsTrigger>
            <TabsTrigger value="insets">Insets</TabsTrigger>
          </TabsList>

          <TabsContent value="certification">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="mb-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="rounded-xl shadow-md border p-4 bg-white">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">
                        Green Premium Actualized
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-primary">
                      ₹{(metrics.greenPremiumActualized / 100).toLocaleString()}
                      K
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md border p-4 bg-white">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">
                        Green Premium Potential
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-primary">
                      ₹{(metrics.greenPremiumPotential / 100).toLocaleString()}K
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md border p-4 bg-white">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">
                        Green Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-blue-600">
                      {metrics.greenCertifications.current} /{" "}
                      {metrics.greenCertifications.potential}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md border p-4 bg-white">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">Inset Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-purple-600">
                      {metrics.greenInsetProjects}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md border p-4 bg-white">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-sm">
                        Qualifying Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-red-600">
                      {metrics.qualifyingProductCount.current} /{" "}
                      {metrics.qualifyingProductCount.total}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md border p-4 bg-white flex items-center justify-center">
                    <div className="w-full min-w-[200px] aspect-[1/1]">
                      <ResponsivePie
                        data={metrics.donutChartData}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        colors={(d) => d.data.color as string}
                        enableArcLinkLabels={false}
                        legends={[
                          {
                            anchor: "bottom",
                            direction: "row",
                            translateY: 30,
                            itemWidth: 100,
                            itemHeight: 14,
                            itemsSpacing: 4,
                            symbolSize: 12,
                          },
                        ]}
                      />
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suggestions">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {premiumSuggestions.map((suggestion) => (
                    <Card
                      key={suggestion}
                      className="rounded-xl shadow-md border p-4 bg-white flex items-start gap-2 hover:bg-gray-50"
                    >
                      <ArrowUpRight className="text-leaf mt-1" />
                      <span>{suggestion}</span>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="insets">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                Lumen Green Credit Insets Registry
              </h2>
              <div className="rounded-xl shadow-md border overflow-x-auto">
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
                      <TableRow
                        key={row.gciRegistration}
                        className="even:bg-beige"
                      >
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
