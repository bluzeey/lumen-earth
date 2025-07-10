import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Required"),
  material: z.string().min(1, "Required"),
  ghgPerTonne: z.number().min(0, "Must be ≥ 0"),
  totalProcessed: z.number().min(0, "Must be ≥ 0"),
  methodology: z.string().optional(),
  creditValue: z.number().min(0, "Must be ≥ 0"),
  status: z.enum(["Draft", "Verified"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  trigger: React.ReactNode;
  initialData?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
}

export function InsetProjectFormDialog({
  trigger,
  initialData,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      material: "",
      ghgPerTonne: 0,
      totalProcessed: 0,
      methodology: "",
      creditValue: 0,
      status: "Draft",
    },
  });

  // Populate for editing
  useEffect(() => {
    if (initialData) reset({ ...initialData });
  }, [initialData, reset]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {initialData ? "Edit Project" : "Add Project"}
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-4"
        >
          <div>
            <Label>Project Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Material Type</Label>
            <Input {...register("material")} />
            {errors.material && (
              <p className="text-sm text-red-600">{errors.material.message}</p>
            )}
          </div>

          <div>
            <Label>Estimated GHG Savings (per tonne)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("ghgPerTonne", { valueAsNumber: true })}
            />
            {errors.ghgPerTonne && (
              <p className="text-sm text-red-600">
                {errors.ghgPerTonne.message}
              </p>
            )}
          </div>

          <div>
            <Label>Total Material Processed (tonnes)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("totalProcessed", { valueAsNumber: true })}
            />
            {errors.totalProcessed && (
              <p className="text-sm text-red-600">
                {errors.totalProcessed.message}
              </p>
            )}
          </div>

          <div>
            <Label>Emission Calculation Methodology</Label>
            <Textarea rows={3} {...register("methodology")} />
          </div>

          <div>
            <Label>Estimated Credit Value (₹/tonne)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("creditValue", { valueAsNumber: true })}
            />
            {errors.creditValue && (
              <p className="text-sm text-red-600">
                {errors.creditValue.message}
              </p>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(val) =>
                setValue("status", val as "Draft" | "Verified")
              }
              defaultValue={initialData?.status || "Draft"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {initialData ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
