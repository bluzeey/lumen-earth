import { useState } from "react";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/ui/select";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { InsetProjectFormDialog } from "src/components/insets/InsetProjectDialog";
import AppLayout from "src/layouts/AppLayout";

// Mock GHG savings per material type (tonnes CO₂e per tonne processed)
const MATERIAL_FACTORS: Record<string, number> = {
  "PET Plastic": 2.3,
  Cotton: 1.8,
  Aluminum: 10.5,
  Steel: 5.2,
};

const DEFAULT_CREDIT_VALUE = 1500; // ₹ per tonne CO₂e

export default function GHGValueEstimatorPage() {
  const [material, setMaterial] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const ghgFactor = MATERIAL_FACTORS[material] || 0;
  const estimatedGHG = quantity * ghgFactor;
  const estimatedValue = estimatedGHG * DEFAULT_CREDIT_VALUE;

  return (
    <AppLayout title="GHG Value Estimator">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold">GHG Inset Value Estimator</h1>

        <div className="space-y-4">
          <div>
            <Label>Material Type</Label>
            <Select onValueChange={(val) => setMaterial(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MATERIAL_FACTORS).map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity (tonnes)</Label>
            <Input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {material && quantity > 0 && (
          <Card className="mt-6">
            <CardContent className="space-y-4 py-6">
              <div className="text-lg font-medium">
                You saved approximately{" "}
                <span className="text-green-600">
                  {estimatedGHG.toFixed(2)} tonnes CO₂e
                </span>
              </div>
              <div className="text-md">
                Estimated inset value:{" "}
                <span className="font-semibold text-emerald-700">
                  ₹{estimatedValue.toFixed(0)}
                </span>
              </div>

              <InsetProjectFormDialog
                trigger={<Button variant="outline">Save as New Project</Button>}
                initialData={{
                  name: "",
                  material,
                  ghgPerTonne: ghgFactor,
                  totalProcessed: quantity,
                  creditValue: DEFAULT_CREDIT_VALUE,
                  status: "Draft",
                }}
                onSubmit={(data) => {
                  console.log("Saved Project:", data);
                  // TODO: optionally redirect or show toast
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
