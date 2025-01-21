import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../utils/cn';

const Documents = () => {
  const documents = [
    { 
      type: 'Insurance Card',
      date: 'Mar 1, 2024',
      status: 'Verified',
      category: 'Insurance'
    },
    { 
      type: 'Treatment Plan',
      date: 'Feb 28, 2024',
      status: 'New',
      category: 'Clinical'
    },
    { 
      type: 'Medical History',
      date: 'Feb 15, 2024',
      status: 'Updated',
      category: 'Records'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ngenius-black">Documents</h1>
          <p className="text-ngenius-gray-500 mt-1">View and manage your documents</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-ngenius-primary rounded-lg hover:bg-ngenius-primary/90">
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-ngenius-gray-200"
        >
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-ngenius-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icons.FileText className="w-5 h-5 text-ngenius-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-ngenius-gray-900">{doc.type}</p>
                    <p className="text-sm text-ngenius-gray-500">
                      Uploaded on {doc.date}
                    </p>
                    <p className="text-sm text-ngenius-gray-500">
                      Category: {doc.category}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn(
                    "px-3 py-1 text-sm font-medium rounded-full",
                    doc.status === 'Verified' && "text-green-700 bg-green-100",
                    doc.status === 'New' && "text-blue-700 bg-blue-100",
                    doc.status === 'Updated' && "text-yellow-700 bg-yellow-100"
                  )}>
                    {doc.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-sm text-ngenius-primary hover:underline">
                      View
                    </button>
                    <button className="text-sm text-ngenius-primary hover:underline">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Documents;