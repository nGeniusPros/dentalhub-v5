import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../utils/cn';

const Billing = () => {
  const transactions = [
    { 
      date: 'Mar 1, 2024',
      description: 'Payment',
      amount: -150.00,
      method: 'Credit Card'
    },
    { 
      date: 'Feb 15, 2024',
      description: 'Cleaning Service',
      amount: 200.00,
      status: 'Due'
    },
    { 
      date: 'Feb 1, 2024',
      description: 'X-Ray',
      amount: 300.00,
      status: 'Due'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ngenius-black">Billing & Payments</h1>
          <p className="text-ngenius-gray-500 mt-1">Manage your account balance and payments</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-ngenius-primary rounded-lg hover:bg-ngenius-primary/90">
          Make Payment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-ngenius-gray-200"
        >
          <div className="mb-6 p-4 bg-ngenius-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-ngenius-gray-500">Current Balance</p>
                <p className="text-3xl font-bold text-ngenius-primary">$350.00</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-ngenius-gray-500">Next Payment Due</p>
                <p className="text-lg font-semibold text-ngenius-gray-900">Mar 15, 2024</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-ngenius-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icons.DollarSign className="w-5 h-5 text-ngenius-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-ngenius-gray-900">{transaction.description}</p>
                    <p className="text-sm text-ngenius-gray-500">{transaction.date}</p>
                    {transaction.method && (
                      <p className="text-sm text-ngenius-gray-500">Paid via {transaction.method}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-semibold",
                    transaction.amount < 0 ? "text-green-600" : "text-ngenius-gray-900"
                  )}>
                    {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  {transaction.status && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full text-yellow-700 bg-yellow-100">
                      {transaction.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Billing;