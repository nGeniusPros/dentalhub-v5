import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';

interface EmployeeRecordsAccessProps {
  isOpen: boolean;
  onClose: () => void;
  onAccess: () => void;
  employeeId: string;
}

export const EmployeeRecordsAccess: React.FC<EmployeeRecordsAccessProps> = ({
  isOpen,
  onClose,
  onAccess,
  employeeId
}) => {
  const { user } = useAuth();

  const hasHRAccess = user?.user_metadata?.role === 'admin' || 
    user?.user_metadata?.role === 'hr';

  const accessLevels = [
    { name: 'Personal Information', access: true },
    { name: 'Performance Reviews', access: user?.user_metadata?.role === 'admin' },
    { name: 'Salary Information', access: user?.user_metadata?.role === 'admin' },
    { name: 'Medical Records', access: user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'hr' },
    { name: 'Training Records', access: true },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasHRAccess) {
      alert('You do not have permission to access employee records');
      return;
    }
    
    onAccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Access Employee Records</h2>
            <button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Icons.Shield className="w-5 h-5" />
              <p className="text-sm font-medium">Restricted Access</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              This area contains sensitive employee information and requires additional authentication.
            </p>
          </div>

          {!hasHRAccess && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <Icons.AlertTriangle className="w-5 h-5" />
                <p className="text-sm font-medium">Access Denied</p>
              </div>
              <p className="text-sm text-red-700 mt-1">
                You do not have the required permissions to access employee records.
                Please contact your administrator.
              </p>
            </div>
          )}

          {hasHRAccess && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Records Access</h3>
                
                <div className="grid gap-3">
                  {accessLevels.map((level, index) => (
                    <motion.div
                      key={level.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${level.access ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {level.access ? (
                            <Icons.Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Icons.Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-700">{level.name}</span>
                      </div>
                      <span className={`text-sm ${level.access ? 'text-green-600' : 'text-gray-400'}`}>
                        {level.access ? 'Access Granted' : 'No Access'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit">
                  Access Records
                </button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};