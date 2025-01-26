import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "../../lib/utils/currency";

interface AdjustDeductionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  onSave: (deductions: any) => void;
}

export const AdjustDeductionsModal: React.FC<AdjustDeductionsModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  onSave,
}) => {
  const [deductions, setDeductions] = useState({
    federalTax: 0,
    stateTax: 0,
    medicare: 0,
    socialSecurity: 0,
    retirement401k: 0,
    healthInsurance: 0,
    dentalInsurance: 0,
    visionInsurance: 0,
    otherDeductions: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(deductions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Adjust Deductions</h2>
              <p className="text-sm text-gray-500">{employeeName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Tax Deductions
              </h3>
              <div className="space-y-4">
                {[
                  { key: "federalTax", label: "Federal Tax" },
                  { key: "stateTax", label: "State Tax" },
                  { key: "medicare", label: "Medicare" },
                  { key: "socialSecurity", label: "Social Security" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {label}
                    </label>
                    <div className="relative">
                      <Icons.DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={deductions[key as keyof typeof deductions]}
                        onChange={(e) =>
                          setDeductions((prev) => ({
                            ...prev,
                            [key]: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Benefits Deductions
              </h3>
              <div className="space-y-4">
                {[
                  { key: "retirement401k", label: "401(k)" },
                  { key: "healthInsurance", label: "Health Insurance" },
                  { key: "dentalInsurance", label: "Dental Insurance" },
                  { key: "visionInsurance", label: "Vision Insurance" },
                  { key: "otherDeductions", label: "Other Deductions" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {label}
                    </label>
                    <div className="relative">
                      <Icons.DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={deductions[key as keyof typeof deductions]}
                        onChange={(e) =>
                          setDeductions((prev) => ({
                            ...prev,
                            [key]: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Deductions</span>
              <span className="text-lg font-semibold">
                {formatCurrency(
                  Object.values(deductions).reduce((sum, val) => sum + val, 0),
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
