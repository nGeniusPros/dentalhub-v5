import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatCurrency } from "../../lib/utils/currency";
import type { PayrollData } from "./types";

interface PayrollSummaryProps {
  data: PayrollData;
  onSubmit: () => void;
}

export const PayrollSummary: React.FC<PayrollSummaryProps> = ({
  data,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Payroll Summary</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Provider:</span>
          <span className="font-medium">{data.provider?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Hours</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Regular Hours</span>
              <span className="font-medium">{data.summary.regularHours}</span>
            </div>
            <div className="flex justify-between">
              <span>Overtime Hours</span>
              <span className="font-medium">{data.summary.overtimeHours}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-medium">Total Hours</span>
              <span className="font-medium">{data.summary.totalHours}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Gross Pay</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Regular Pay</span>
              <span className="font-medium">
                {formatCurrency(data.summary.totalGrossPay)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Overtime Pay</span>
              <span className="font-medium">
                {formatCurrency(data.summary.totalGrossPay * 0.5)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-medium">Total Gross</span>
              <span className="font-medium">
                {formatCurrency(data.summary.totalGrossPay)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Deductions</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-medium">
                {formatCurrency(data.summary.totalDeductions * 0.7)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Benefits</span>
              <span className="font-medium">
                {formatCurrency(data.summary.totalDeductions * 0.3)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-medium">Total Net</span>
              <span className="font-medium">
                {formatCurrency(data.summary.totalNetPay)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icons.Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Ready to Submit</h4>
            <p className="text-sm text-blue-700">
              Please review the payroll summary carefully before submitting.
              Once submitted, the payroll will be processed according to your
              provider's schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
