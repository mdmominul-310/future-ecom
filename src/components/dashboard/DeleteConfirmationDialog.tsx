"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export function DeleteConfirmationDialog({
  open,
  setOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: DeleteConfirmDialogProps) {
  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
