"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MonthlyTargetDialogProps {
  open: boolean;
  onClose: () => void;
  setTargetchange: (value: boolean) => void;
  targetChange: boolean;
}

export default function MonthlyTargetDialog({
  open,
  onClose,
  setTargetchange,
  targetChange,
}: MonthlyTargetDialogProps) {
  const [initialTarget, setInitialTarget] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing target when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/dashboard/target")
        .then((res) => res.json())
        .then((data) => {
          setInitialTarget(data.target);
          setTarget(data.target);
        })
        .catch(() => toast.error("Failed to load target"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Save updated target
  const handleSave = async () => {
    if (target === null || target === initialTarget) return;

    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setTargetchange(!targetChange);

      toast.success("Monthly target updated");
      setInitialTarget(target);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update target");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Monthly Target</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Enter monthly target"
            value={target ?? ""}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={loading}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={loading || target === null || target === initialTarget}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
