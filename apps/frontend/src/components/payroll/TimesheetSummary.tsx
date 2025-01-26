import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "../../lib/utils/currency";
import type { Timesheet, PayPeriod } from "./types";

interface TimesheetSummaryProps {
  isLoading: boolean;
  timesheets: Timesheet[];
  payPeriod: PayPeriod;
}

export const TimesheetSummary: React.FC<TimesheetSummaryProps> = ({
  isLoading,
  timesheets,
  payPeriod,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Timesheet Review</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Pay Period:</span>
          <span className="font-medium">
            {payPeriod.startDate} - {payPeriod.endDate}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regular Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overtime
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PTO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Pay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Pay
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timesheets.map((timesheet) => (
              <tr key={timesheet.employeeId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {timesheet.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {timesheet.regularHours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {timesheet.overtimeHours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {timesheet.ptoHours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(timesheet.grossPay)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(timesheet.deductions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(timesheet.netPay)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button variant="ghost" size="sm">
                    <Icons.FileText className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
