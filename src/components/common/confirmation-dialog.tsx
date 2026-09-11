import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  trigger: React.ReactElement;
  title: string;
  description: string;
  showCancel?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  showCancel=true,
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {showCancel && <DialogClose render={<Button variant="outline" className={"cursor-pointer"}/>}>
            {cancelLabel}
          </DialogClose>}

          <DialogClose
            render={<Button onClick={onConfirm} className={"cursor-pointer bg-black text-white"} variant="outline">{confirmLabel}</Button>}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
