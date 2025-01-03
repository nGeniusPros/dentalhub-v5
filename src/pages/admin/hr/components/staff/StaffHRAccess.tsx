import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

interface StaffHRAccessProps {
  isOpen: boolean;
  staffId?: string;
  onClose: () => void;
}

export const StaffHRAccess: React.FC<StaffHRAccessProps> = ({
  isOpen,
  staffId,
  onClose
}) => {
  if (!isOpen) return null;

  const hrFiles = [
    { name: 'Employment Contract', type: 'PDF', date: '2024-01-15' },
    { name: 'W-4 Form', type: 'PDF', date: '2024-01-15' },
    { name: 'I-9 Form', type: 'PDF', date: '2024-01-15' },
    { name: 'Direct Deposit Form', type: 'PDF', date: '2024-01-15' },
    { name: 'Benefits Enrollment', type: 'PDF', date: '2024-01-15' },
    { name: 'Emergency Contact', type: 'PDF', date: '2024-01-15' },
    { name: 'Performance Reviews', type: 'Folder', date: '2024-03-01' },
    { name: 'Certifications', type: 'Folder', date: '2024-02-15' },
    { name: 'Training Records', type: 'Folder', date: '2024-02-01' },
    { name: 'Payroll History', type: 'Folder', date: '2024-03-01' },
    { name: 'Time Off Records', type: 'Folder', date: '2024-03-01' },
    { name: 'Disciplinary Actions', type: 'Folder', date: '2024-03-01' },
    { name: 'Exit Interview', type: 'PDF', date: '2024-03-01' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">HR Files Access</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Upload Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Upload HR Document</h3>
              <Button>
                <Icons.Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex flex-col items-center">
                <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hrFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  {file.type === 'PDF' ? (
                    <Icons.FileText className="w-6 h-6 text-red-500" />
                  ) : (
                    <Icons.Folder className="w-6 h-6 text-yellow-500" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">Last updated: {file.date}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Icons.Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Icons.Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Info className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium text-blue-900">Access Information</h3>
            </div>
            <p className="text-sm text-blue-800">
              These files contain sensitive information. All access is logged and monitored.
              Please ensure compliance with privacy policies when handling these documents.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};