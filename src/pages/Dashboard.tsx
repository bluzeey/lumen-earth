import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, User, LogOut } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";

export default function MaterialFlowTracer() {
  return (
    <AppLayout>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar */}
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-semibold">Material Flow Tracer</h1>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Tabs defaultValue="week23">
              <TabsList>
                <TabsTrigger value="week22">Week 22</TabsTrigger>
                <TabsTrigger value="week23">Week 23</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Material Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kerala">Karnataka, Kerala</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-gray-500 text-sm">Qty In</div>
                <div className="text-2xl font-bold text-green-600">
                  2.72 T (A)
                </div>
                <div className="text-sm text-gray-500">
                  3.20 T (F) (85% accuracy)
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-gray-500 text-sm">Qty Out</div>
                <div className="text-2xl font-bold text-green-600">
                  2.24 T (A)
                </div>
                <div className="text-sm text-gray-500">
                  2.65 T (F) (84.6% accuracy)
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-gray-500 text-sm">Yield %</div>
                <div className="text-2xl font-bold text-orange-600">82.3%</div>
                <div className="text-sm text-gray-500">83% (F)</div>
              </CardContent>
            </Card>
            <Card className="text-center border-red-500 border-2">
              <CardContent className="py-4">
                <div className="text-gray-500 text-sm">Orders At Risk</div>
                <div className="text-2xl font-bold text-red-600">₹28.9K</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2">Batch ID</th>
                  <th className="p-2">Material Name</th>
                  <th className="p-2">Composition</th>
                  <th className="p-2">Supplier</th>
                  <th className="p-2">Raw M Qty (in Tonnage)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">XA00024</td>
                  <td className="p-2">Bed linen</td>
                  <td className="p-2">100% Cotton</td>
                  <td className="p-2">Ibis Hotels Karalkia</td>
                  <td className="p-2">0.05 T</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">YA00245</td>
                  <td className="p-2">Cushion covers</td>
                  <td className="p-2">100% Cotton</td>
                  <td className="p-2">Taj Vivanta Kerala Zone 2</td>
                  <td className="p-2">0.15 T</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">XB00025</td>
                  <td className="p-2">Floor mats</td>
                  <td className="p-2">80% Cotton + 20% Polyester</td>
                  <td className="p-2">Taj Vivanta Kerala Zone 1</td>
                  <td className="p-2">0.20 T</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">XC00042</td>
                  <td className="p-2">Bath towels</td>
                  <td className="p-2">Cotton Poly Blends 60-40% Yarn</td>
                  <td className="p-2">Independent Chain 1</td>
                  <td className="p-2">2.32 T</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Placeholder for Sankey Chart */}
          <Card>
            <CardContent className="p-4 text-sm text-gray-600">
              Sankey chart visual goes here.
            </CardContent>
          </Card>
        </main>
      </div>
    </AppLayout>
  );
}
