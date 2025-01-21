import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';
import { ExportReportDialog } from './ExportReportDialog';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../../lib/utils/export';

export const PayrollSummary = () => {
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const data = [
    { month: 'Jan', salary: 85000, bonus: 5000, benefits: 15000 },
    { month: 'Feb', salary: 85000, bonus: 4500, benefits: 15000 },
    { month: 'Mar', salary: 87000, bonus: 6000, benefits: 15500 },
    { month: 'Apr', salary: 87000, bonus: 5500, benefits: 15500 },
    { month: 'May', salary: 88000, bonus: 7000, benefits: 16000 },
    { month: 'Jun', salary: 88000, bonus: 6500, benefits: 16000 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Payroll Overview</h2>
          <p className="text-sm text-gray-500">Monthly payroll analytics</p>
        </div>
        <Button variant="outline" size="sm">
          <Icons.Download className="w-4 h-4 mr-2" />
          <span onClick={() => setShowExportDialog(true)}>Export Report</span>
        </Button>
      </div>
      
      <ExportReportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={(format, options) => {
          const exportData = data.map(item => ({
            month: item.month,
            salary: item.salary,
            bonus: item.bonus,
            benefits: item.benefits,
            total: item.salary + item.bonus + item.benefits
          }));

          if (format === 'csv') {
            exportToCSV(exportData, 'payroll-summary');
          } else if (format === 'excel') {
            exportToExcel(exportData, 'payroll-summary');
          } else if (format === 'pdf') {
            exportToPDF(exportData, 'payroll-summary');
          }
        }}
      />

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="salary" name="Salary" fill="#4BC5BD" stackId="a" />
            <Bar dataKey="bonus" name="Bonus" fill="#6B4C9A" stackId="a" />
            <Bar dataKey="benefits" name="Benefits" fill="#C5A572" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Total Payroll</h3>
          <p className="text-2xl font-bold text-primary">$110,500</p>
          <p className="text-sm text-gray-500">Current month</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Avg Salary</h3>
          <p className="text-2xl font-bold text-primary">$4,604</p>
          <p className="text-sm text-gray-500">Per employee</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Benefits Cost</h3>
          <p className="text-2xl font-bold text-primary">$16,000</p>
          <p className="text-sm text-gray-500">Current month</p>
        </div>
      </div>
    </motion.div>
  );
};