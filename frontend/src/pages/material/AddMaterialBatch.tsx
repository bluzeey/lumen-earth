import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { Calendar } from "src/components/ui/calendar";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import AppLayout from "src/layouts/AppLayout";

const sources = ["Hotel", "Factory", "Hospital", "Warehouse"];
const materials = ["Cotton", "Polyester", "Wool", "Nylon", "Recycled Plastic"];

const batchSchema = z.object({
  source: z.string().nonempty("Source is required"),
  material: z.string().nonempty("Material is required"),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Weight must be a positive number",
  }),
  date: z.date({ required_error: "Date is required" }),
  composition: z.string().nonempty("Composition is required"),
  documents: z.any().refine((files) => files?.length > 0, {
    message: "At least one document is required",
  }),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export default function NewMaterialBatchPage() {
  const navigate = useNavigate();
  const batchId = uuidv4().slice(0, 8);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      source: "",
      material: "",
      weight: "",
      date: undefined,
      composition: "",
      documents: [],
    },
  });

  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const previewUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setValue("documents", files);
    setPreviews(previewUrls);
  };

  const onSubmit = () => {
    toast.success("Material batch created");
    navigate({ to: `/material/${batchId}` });
  };

  return (
    <AppLayout title="Add Materials">
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-2xl font-semibold">Create New Material Batch</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Source */}
          <div>
            <Label>Source</Label>
            <Controller
              control={control}
              name="source"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((src) => (
                      <SelectItem key={src} value={src}>
                        {src}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source.message}</p>
            )}
          </div>

          {/* Material */}
          <div>
            <Label>Material Type</Label>
            <Controller
              control={control}
              name="material"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((mat) => (
                      <SelectItem key={mat} value={mat}>
                        {mat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.material && (
              <p className="text-red-500 text-sm">{errors.material.message}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <Label>Weight (kg)</Label>
            <Input type="text" {...register("weight")} />
            {errors.weight && (
              <p className="text-red-500 text-sm">{errors.weight.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col space-y-2">
            <Label>Date</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* Composition */}
          <div>
            <Label>Composition</Label>
            <Textarea rows={3} {...register("composition")} />
            {errors.composition && (
              <p className="text-red-500 text-sm">
                {errors.composition.message}
              </p>
            )}
          </div>

          {/* Batch ID */}
          <div>
            <Label>Batch ID</Label>
            <Input disabled value={batchId} />
          </div>

          {/* Upload */}
          <div>
            <Label>Chain of Custody Documents</Label>
            <Input
              type="file"
              multiple
              accept="application/pdf,image/*"
              onChange={handleFileChange}
            />
            {errors.documents && (
              <p className="text-red-500 text-sm">
                {errors.documents.message as string}
              </p>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2">
              {previews.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`doc-${idx}`}
                  className="h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Batch
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
