import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { formatCurrency } from '../../lib/utils/currency';

interface PayStubsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  onDownload: (payPeriod: string) => void;
}

export const PayStubsModal: React.FC<PayStubsModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  onDownload
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  const payStubs = [
    {
      id: '1',
      payPeriod: 'Mar 1-15, 2024',
      grossPay: 2500,
      netPay: 1875,
      status: 'available'
    },
    {
      id: '2',
      payPeriod: 'Feb 15-28, 2024',
      grossPay: 2500,
      netPay: 1875,
      status: 'available'
    }
  ];

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
            <div>
              <h2 className="text-xl font-semibold">Pay Stubs</h2>
              <p className="text-sm text-gray-500">{employeeName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
            <Button variant="outline">
              <Icons.Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>

          <div className="space-y-4">
            {payStubs.map((stub) => (
              <div
                key={stub.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{stub.payPeriod}</p>
                  <div className="mt-1 space-x-4 text-sm text-gray-500">
                    <span>Gross: {formatCurrency(stub.grossPay)}</span>
                    <span>Net: {formatCurrency(stub.netPay)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(stub.payPeriod)}
                >
                  <Icons.Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};