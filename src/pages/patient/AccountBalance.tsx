import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const AccountBalance = () => {
  const balanceInfo = {
    total: 850.00,
    nextPayment: '2024-03-20',
    paymentPlan: {
      monthly: 150.00,
      remaining: 4
    }
  };

  const recentCharges = [
    {
      date: '2024-03-01',
      description: 'Dental Cleaning',
      amount: 200.00,
      status: 'Pending Insurance'
    },
    {
      date: '2024-02-15',
      description: 'X-Ray Series',
      amount: 350.00,
      status: 'Insurance Processed'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Account Balance</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Make Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">Current Balance</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-600">
              ${balanceInfo.total.toFixed(2)}
            </span>
            <span className="text-gray-500">total due</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Next Payment Due:</span>
              <span className="font-medium">{balanceInfo.nextPayment}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monthly Payment:</span>
              <span className="font-medium">${balanceInfo.paymentPlan.monthly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Remaining Payments:</span>
              <span className="font-medium">{balanceInfo.paymentPlan.remaining}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icons.CreditCard className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/25</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Default
              </span>
            </div>
            <button className="w-full px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
              Add Payment Method
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Charges</h2>
        <div className="space-y-4">
          {recentCharges.map((charge, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{charge.description}</p>
                <p className="text-sm text-gray-500">{charge.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${charge.amount.toFixed(2)}</p>
                <span className="text-sm text-primary-600">{charge.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AccountBalance;