import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Calendar } from "src/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const logSchema = z.object({
  input: z.number().min(0.01, "Input must be greater than 0"),
  output: z.number().min(0, "Output cannot be negative"),
  date: z.date({ required_error: "Date is required" }),
  note: z.string().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

export function AddInventoryLogDialog({
  onAdd,
}: {
  onAdd: (log: LogFormValues & { yieldPct: string; lossPct: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      input: 0,
      output: 0,
      date: undefined,
      note: "",
    },
  });

  const input = watch("input");
  const output = watch("output");

  const yieldPct = input > 0 ? ((output / input) * 100).toFixed(1) : "0.0";
  const lossPct = input > 0 ? (100 - parseFloat(yieldPct)).toFixed(1) : "0.0";

  const onSubmit = (data: LogFormValues) => {
    onAdd({ ...data, yieldPct, lossPct });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Inventory Log</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add Inventory Log</DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label>Input Quantity (kg)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("input", { valueAsNumber: true })}
            />
            {errors.input && (
              <p className="text-sm text-red-600">{errors.input.message}</p>
            )}
          </div>

          <div>
            <Label>Output Quantity (kg)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("output", { valueAsNumber: true })}
            />
            {errors.output && (
              <p className="text-sm text-red-600">{errors.output.message}</p>
            )}
          </div>

          <div>
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
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <Label>Note (optional)</Label>
            <Textarea rows={2} {...register("note")} />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Yield:</strong> {yieldPct}% &nbsp;&nbsp;
              <strong>Loss:</strong> {lossPct}%
            </p>
          </div>

          <Button type="submit" className="w-full">
            Save Log
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
