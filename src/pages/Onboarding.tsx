import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multiselect";

const materialOptions = [
  { label: "Cotton", value: "cotton" },
  { label: "Polyester", value: "polyester" },
  { label: "Wool", value: "wool" },
  { label: "Nylon", value: "nylon" },
  { label: "Recycled Plastic", value: "recycled_plastic" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");
  const [materials, setMaterials] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const user = { name: "Jane" }; // Replace with real auth context

  function nextStep() {
    if (step === 1 && (!orgName || !location)) {
      toast.error("Please provide organization name and location");
      return;
    }
    if (step === 2 && materials.length === 0) {
      toast.error("Please select at least one material");
      return;
    }
    if (step === 3 && !accepted) {
      toast.error("Please accept the terms");
      return;
    }
    if (step === 3) {
      toast.success("Welcome to Lumen!");
      navigate({ to: "/app/traceability" });
    } else {
      setStep((s) => s + 1);
    }
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name} 👋</h1>
      <div className="space-y-6">
        {step === 0 && (
          <div>
            <p className="text-muted-foreground">
              Let’s complete your onboarding to get started.
            </p>
            <Button className="mt-4" onClick={nextStep}>
              Start
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="org">Organization Name</Label>
              <Input
                id="org"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Label>Material Types</Label>
            <MultiSelect
              options={materialOptions}
              selected={materials}
              onChange={setMaterials}
              placeholder="Select materials"
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={setAccepted}
            />
            <Label htmlFor="terms">
              I accept the{" "}
              <a href="/terms" className="underline">
                terms and conditions
              </a>
              .
            </Label>
          </div>
        )}

        {step > 0 && (
          <div className="flex justify-between pt-6">
            <Button variant="ghost" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>
              {step === 3 ? "Go to Dashboard" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
