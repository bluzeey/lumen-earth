import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScatterPoint {
  pricePerKg: number;
  score: number;
}

interface MarketActivityProps {
  activeListings: number;
  transactionsThisMonth: number;
  totalVolumes: string;
  scatterPoints: ScatterPoint[];
}

export default function MarketActivityChart({
  activeListings,
  transactionsThisMonth,
  totalVolumes,
  scatterPoints,
}: MarketActivityProps) {
  return (
    <Card className="rounded-md shadow-sm  bg-white">
      <CardHeader>
        <CardTitle className="text-charcoal font-semibold">
          Market Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">Active Listings: {activeListings}</div>
        <div className="text-sm">
          Transactions This Month: {transactionsThisMonth}
        </div>
        <div className="text-sm">Total Volume: {totalVolumes}</div>
        <ResponsiveContainer width="100%" height={300} className="p-2">
          <ScatterChart>
            <XAxis
              type="number"
              dataKey="score"
              name="Score"
              label={{
                value: "Sourcing ethics and Sustainability Score",
                position: "insideBottom",
                dy: 10,
              }}
            />
            <YAxis
              type="number"
              dataKey="pricePerKg"
              name="Price"
              unit="₹"
              label={{
                value: "Price per Kg",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={scatterPoints} fill="#2C543F" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
