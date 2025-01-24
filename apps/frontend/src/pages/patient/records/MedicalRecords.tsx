import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNotifications } from '../../../contexts/NotificationContext';

interface MedicalRecord {
  id: string;
  date: string;
  type: 'visit' | 'procedure' | 'prescription' | 'lab-result';
  title: string;
  description: string;
  provider: string;
  attachments?: {
    name: string;
    type: string;
    size: string;
  }[];
}

export const MedicalRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { dispatch: notifyDispatch } = useNotifications();

  const [records] = useState<MedicalRecord[]>([
    {
      id: '1',
      date: '2025-01-15',
      type: 'visit',
      title: 'Regular Check-up',
      description: 'Routine dental examination and cleaning',
      provider: 'Dr. Sarah Wilson',
      attachments: [
        {
          name: 'dental-xray-2025-01.pdf',
          type: 'PDF',
          size: '2.4 MB',
        },
      ],
    },
    {
      id: '2',
      date: '2025-01-02',
      type: 'procedure',
      title: 'Cavity Filling',
      description: 'Composite filling on upper right molar',
      provider: 'Dr. Michael Chen',
      attachments: [
        {
          name: 'procedure-notes.pdf',
          type: 'PDF',
          size: '1.1 MB',
        },
        {
          name: 'post-procedure-xray.jpg',
          type: 'Image',
          size: '3.2 MB',
        },
      ],
    },
  ]);

  const handleDownload = (recordId: string, attachmentName: string) => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'info',
        title: 'Download Started',
        message: `Downloading ${attachmentName}...`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and manage your dental records and history
        </p>
      </div>

      {/* Record Type Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'visits', label: 'Visits' },
            { id: 'procedures', label: 'Procedures' },
            { id: 'prescriptions', label: 'Prescriptions' },
            { id: 'lab-results', label: 'Lab Results' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-md ${
                activeTab === id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {records.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.type === 'visit'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                          : record.type === 'procedure'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : record.type === 'prescription'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                      } mr-2`}
                    >
                      {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {record.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {record.date} • {record.provider}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Icons.MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{record.description}</p>

              {record.attachments && record.attachments.length > 0 && (
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {record.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        <div className="flex items-center">
                          <Icons.File className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {attachment.type} • {attachment.size}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(record.id, attachment.name)}
                        >
                          <Icons.Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
