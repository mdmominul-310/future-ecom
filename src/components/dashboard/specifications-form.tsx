"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import type { ProductSpecification } from "@/types/product";

interface SpecificationsFormProps {
  specifications: ProductSpecification[];
  onSpecificationChange: (index: number, field: string, value: string) => void;
  onAddSpecification: () => void;
  onRemoveSpecification: (index: number) => void;
}

export function SpecificationsForm({
  specifications,
  onSpecificationChange,
  onAddSpecification,
  onRemoveSpecification,
}: SpecificationsFormProps) {
  return (
    <div className="space-y-4">
      {specifications.map((spec, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 border rounded-md p-4 border-gray-200 dark:border-gray-700"
        >
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`spec-name-${index}`}>Specification</Label>
              <Input
                id={`spec-name-${index}`}
                value={spec.name}
                onChange={(e) =>
                  onSpecificationChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`spec-value-${index}`}>Value</Label>
              <Input
                id={`spec-value-${index}`}
                value={spec.value}
                onChange={(e) =>
                  onSpecificationChange(index, "value", e.target.value)
                }
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => onRemoveSpecification(index)}
            disabled={specifications.length === 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onAddSpecification}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Specification
      </Button>
    </div>
  );
}
