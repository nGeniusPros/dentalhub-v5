import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useAuthContext } from '../../../../../contexts/AuthContext';

interface EmployeeRecordsAccessProps {
  isOpen: boolean;
  onClose: () => void;
  onAccess: () => void;
}

export const EmployeeRecordsAccess: React.FC<EmployeeRecordsAccessProps> = ({
  isOpen,
  onClose,
  onAccess
}) => {
  const { user } = useAuthContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const hasHRAccess = user?.role === 'admin' || 
    user?.permissions?.includes('hr.full_access');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasHRAccess) {
      setError('You do not have permission to access employee records');
      return;
    }
    
    // In production, verify password against secure backend
    if (password === 'admin123') {
      onAccess();
      onClose();
    } else {
      setError('Invalid password');
    }
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
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Your Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                  <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Access Records
                </Button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};