import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { PayrollProviderSelector } from "./PayrollProviderSelector";
import { PayrollSummary } from "./PayrollSummary";
import { TimesheetSummary } from "./TimesheetSummary";
import { useNotifications } from "../../contexts/NotificationContext";
import type { PayrollProvider, PayrollData } from "./types";

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payrollData: PayrollData) => void;
}

export const PayrollModal: React.FC<PayrollModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] =
    useState<PayrollProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [payrollData, setPayrollData] = useState<PayrollData>({
    provider: null,
    payPeriod: {
      startDate: "",
      endDate: "",
    },
    timesheets: [],
    summary: {
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      totalGrossPay: 0,
      totalDeductions: 0,
      totalNetPay: 0,
    },
  });

  const { dispatch: notifyDispatch } = useNotifications();

  useEffect(() => {
    if (selectedProvider) {
      fetchPayrollData();
    }
  }, [selectedProvider]);

  const fetchPayrollData = async () => {
    setIsLoading(true);
    try {
      // In production, this would make API calls to the selected provider
      // For now, simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data
      setPayrollData({
        provider: selectedProvider,
        payPeriod: {
          startDate: "2024-03-01",
          endDate: "2024-03-15",
        },
        timesheets: [
          {
            employeeId: "1",
            name: "Dr. Sarah Wilson",
            regularHours: 80,
            overtimeHours: 5,
            ptoHours: 0,
            grossPay: 5000,
            deductions: 1200,
            netPay: 3800,
          },
          // Add more employees...
        ],
        summary: {
          totalHours: 85,
          regularHours: 80,
          overtimeHours: 5,
          totalGrossPay: 5000,
          totalDeductions: 1200,
          totalNetPay: 3800,
        },
      });
    } catch (error) {
      notifyDispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: Date.now().toString(),
          type: "alert",
          title: "Error Fetching Payroll Data",
          message: "Failed to fetch payroll data. Please try again.",
          timestamp: new Date().toISOString(),
          read: false,
          priority: "high",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Run Payroll</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mt-6">
            {[
              { num: 1, label: "Select Provider" },
              { num: 2, label: "Review Timesheets" },
              { num: 3, label: "Confirm & Submit" },
            ].map(({ num, label }) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {num}
                </div>
                <span
                  className={`ml-2 ${
                    step >= num ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {num < 3 && <div className="w-12 h-0.5 mx-2 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <PayrollProviderSelector
              selectedProvider={selectedProvider}
              onSelect={setSelectedProvider}
            />
          )}

          {step === 2 && (
            <TimesheetSummary
              isLoading={isLoading}
              timesheets={payrollData.timesheets}
              payPeriod={payrollData.payPeriod}
            />
          )}

          {step === 3 && (
            <PayrollSummary
              data={payrollData}
              onSubmit={() => onSubmit(payrollData)}
            />
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <Icons.ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                className="ml-auto"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedProvider}
              >
                Next
                <Icons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="ml-auto"
                onClick={() => onSubmit(payrollData)}
                disabled={isLoading}
              >
                <Icons.CheckCircle className="w-4 h-4 mr-2" />
                Submit Payroll
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
