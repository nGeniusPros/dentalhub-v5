import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  data: any;
  type: 'staff' | 'provider' | 'patient';
}

export const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  data,
  type
}) => {
  const [formData, setFormData] = useState(data);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SSN
              </label>
              <input
                type="password"
                value={formData.ssn}
                onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="XXX-XX-XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address?.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address?.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.address?.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.address?.zip}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zip: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* RDA Information (if applicable) */}
          {type === 'staff' && formData.role === 'Dental Assistant' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">RDA Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RDA License Number
                  </label>
                  <input
                    type="text"
                    value={formData.rdaLicense}
                    onChange={(e) => setFormData({ ...formData, rdaLicense: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.rdaExpiration}
                    onChange={(e) => setFormData({ ...formData, rdaExpiration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* HR Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">HR Documents</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icons.FileText className="w-5 h-5 text-gray-400" />
                  <span>Employment Contract</span>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icons.FileText className="w-5 h-5 text-gray-400" />
                  <span>Tax Forms</span>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icons.FileText className="w-5 h-5 text-gray-400" />
                  <span>Training Certificates</span>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termination Date
                </label>
                <input
                  type="date"
                  value={formData.terminationDate}
                  onChange={(e) => setFormData({ ...formData, terminationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select department...</option>
                  <option value="Clinical">Clinical</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payroll Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payroll Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary/Rate
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Frequency
                </label>
                <select
                  value={formData.payFrequency}
                  onChange={(e) => setFormData({ ...formData, payFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};