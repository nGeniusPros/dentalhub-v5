import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import type { MembershipTier } from "../../../../types/membership";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: MembershipTier) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [plan, setPlan] = useState<Partial<MembershipTier>>({
    name: "",
    price: { monthly: 0, annual: 0 },
    benefits: [],
    pointsMultiplier: 1,
  });
  const [newBenefit, setNewBenefit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.name && plan.price) {
      onSave(plan as MembershipTier);
      onClose();
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setPlan((prev) => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setPlan((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
              Create New Membership Plan
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              value={plan.name}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Price ($)
              </label>
              <input
                type="number"
                value={plan.price?.monthly}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    price: {
                      ...prev.price!,
                      monthly: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Price ($)
              </label>
              <input
                type="number"
                value={plan.price?.annual}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    price: {
                      ...prev.price!,
                      annual: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Points Multiplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points Multiplier
            </label>
            <select
              value={plan.pointsMultiplier}
              onChange={(e) =>
                setPlan((prev) => ({
                  ...prev,
                  pointsMultiplier: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
              <option value={5}>5x</option>
            </select>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            <div className="space-y-2 mb-4">
              {plan.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icons.Check className="w-4 h-4 text-green-500" />
                  <span className="flex-1">{benefit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Add a benefit..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBenefit();
                  }
                }}
              />
              <Button type="button" onClick={addBenefit}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Plan</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
