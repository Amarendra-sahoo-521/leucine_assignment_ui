import { useEffect, useState, ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCleaning, useUpdateCleaning } from "../../hooks/useCleaning";

interface CleaningFormValues {
  cleanedBy: string;
  cleanedAt: string; // ISO string, e.g. "2026-09-10"
  method: string;
  notes: string;
  changed_by?: string;
  status: "pending" | "verified";
  eq_id: string | number;
}

interface Cleaning extends CleaningFormValues {
  id: string | number;
}

interface CleaningFormDialogProps {
  trigger: ReactNode;
  mode: "create" | "edit";
  cleaning?: Cleaning;
  eqId: number;
}

const EMPTY_FORM = (eqId?: string | number): CleaningFormValues => ({
  cleanedBy: "",
  cleanedAt: "",
  method: "",
  notes: "",
  changed_by: "",
  status: "pending",
  eq_id: eqId ?? "",
});

export function CleaningFormDialog({
  trigger,
  mode,
  cleaning,
  eqId,
}: CleaningFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<CleaningFormValues>(EMPTY_FORM(eqId));

  const createMutation = useCreateCleaning();
  const updateMutation = useUpdateCleaning();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      setValues(
        mode === "edit" && cleaning
          ? {
              cleanedBy: cleaning.cleanedBy,
              cleanedAt: cleaning.cleanedAt,
              method: cleaning.method,
              notes: cleaning.notes,
              status: cleaning.status,
              eq_id: eqId ?? "",
            }
          : EMPTY_FORM(eqId),
      );
    }
  }, [open, mode, cleaning, eqId]);

  const handleChange = <K extends keyof CleaningFormValues>(
    field: K,
    value: CleaningFormValues[K],
  ) => setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!values.cleanedBy.trim() || !values.cleanedAt || !values.eq_id) return;
    if (mode === "edit" && !values.changed_by?.trim()) return;

    if (mode === "create") {
      createMutation.mutate(values, { onSuccess: () => setOpen(false) });
    } else if (cleaning) {
      const { eq_id, ...rest } = values;
      updateMutation.mutate(
        {
          id: cleaning.id,
          payload: { ...rest, changed_by: values.changed_by ?? "" },
        },
        { onSuccess: () => setOpen(false) },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Cleaning Log" : "Edit Cleaning Log"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Record a new cleaning entry for this equipment."
              : "Update the cleaning log details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="cleanedBy">Cleaned By</Label>
            <Input
              id="cleanedBy"
              value={values.cleanedBy}
              onChange={(e) => handleChange("cleanedBy", e.target.value)}
              placeholder="e.g. Jon"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cleanedAt">Cleaned At</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {values.cleanedAt
                      ? format(new Date(values.cleanedAt), "PPP")
                      : "Pick a date"}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  className="bg-white"
                  selected={
                    values.cleanedAt ? new Date(values.cleanedAt) : undefined
                  }
                  onSelect={(date: any) =>
                    date &&
                    handleChange("cleanedAt", format(date, "yyyy-MM-dd"))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="method">Method</Label>
            <Input
              id="method"
              value={values.method}
              onChange={(e) => handleChange("method", e.target.value)}
              placeholder="e.g. CIP rinse"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={values.status}
              onValueChange={(val: any) => handleChange("status", val)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode == "edit" && (
            <div className="grid gap-1.5">
              <Label htmlFor="changed_by">
                Changed By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="changed_by"
                value={values.changed_by}
                onChange={(e) => handleChange("changed_by", e.target.value)}
                placeholder="e.g. Amar"
                required
              />
            </div>
          )}

          <div className="grid gap-1.5 col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={values.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="e.g. Standard cycle"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="cursor-pointer bg-black text-white"
            variant="outline"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
