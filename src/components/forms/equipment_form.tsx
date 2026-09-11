import { useEffect, useState, ReactNode } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateEquipment,
  useUpdateEquipment,
} from "../../hooks/useEquipments";

interface EquipmentFormValues {
  name: string;
  code: string;
  status: "active" | "retired";
}

interface Equipment extends EquipmentFormValues {
  id: string | number;
  createdAt?: string | number;
  updatedAt?: string | number;
}

interface EquipmentFormDialogProps {
  trigger: ReactNode;
  mode: "create" | "edit";
  equipment?: Equipment;
}

const EMPTY_FORM: EquipmentFormValues = {
  name: "",
  code: "",
  status: "active",
};

export function EquipmentFormDialog({
  trigger,
  mode,
  equipment,
}: EquipmentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<EquipmentFormValues>(EMPTY_FORM);

  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      setValues(
        mode === "edit" && equipment
          ? {
              name: equipment.name,
              code: equipment.code,
              status: equipment.status,
            }
          : EMPTY_FORM,
      );
    }
  }, [open, mode, equipment]);

  const handleChange = (field: keyof EquipmentFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!values.name.trim() || !values.code.trim()) return;

    if (mode === "create") {
      createMutation.mutate(values, { onSuccess: () => setOpen(false) });
    } else if (equipment) {
      updateMutation.mutate(
        { id: equipment.id, payload: values },
        { onSuccess: () => setOpen(false) },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Equipment" : "Edit Equipment"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to add new equipment."
              : "Update the equipment details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Centrifuge Machine"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="code">Code<span className="text-red-500">*</span></Label>
            <Input
              id="code"
              value={values.code}
              className=""
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="e.g. EQ-001"
            />
          </div>

          <div className="grid gap-1.5 ">
            <Label htmlFor="status">Status</Label>
            <Select
              value={values.status}
              onValueChange={(val: any) => handleChange("status", val)}
              
            >
              <SelectTrigger id="status" className={"w-full"}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)} className={"cursor-pointer"}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className={"cursor-pointer bg-black text-white"} variant="outline" disabled={isSubmitting}>
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
