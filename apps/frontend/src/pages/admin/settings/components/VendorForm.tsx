import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import type { Vendor } from '../types/vendor';

interface VendorFormProps {
  vendor?: Vendor;
  onSubmit: (vendor: Partial<Vendor>) => void;
  onCancel: () => void;
}

export const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<Partial<Vendor>>(
    vendor || {
      name: '',
      category: 'Insurance',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      accountNumber: '',
      notes: [],
      labFees: [],
      credentials: {
        username: '',
        password: ''
      }
    }
  );

  const [showFeeUpload, setShowFeeUpload] = React.useState(false);
  const [newFee, setNewFee] = React.useState({
    code: '',
    description: '',
    fee: 0,
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddFee = () => {
    if (newFee.code && newFee.description && newFee.fee) {
      setFormData({
        ...formData,
        labFees: [...(formData.labFees || []), { ...newFee, id: Date.now().toString() }]
      });
      setNewFee({
        code: '',
        description: '',
        fee: 0,
        effectiveDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleFeeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').slice(1); // Skip header row
        const newFees = rows.map(row => {
          const [code, description, fee, effectiveDate] = row.split(',');
          return {
            id: Date.now().toString() + Math.random(),
            code: code.trim(),
            description: description.trim(),
            fee: parseFloat(fee),
            effectiveDate: effectiveDate.trim() || new Date().toISOString().split('T')[0]
          };
        });
        setFormData({
          ...formData,
          labFees: [...(formData.labFees || []), ...newFees]
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            required
          >
            <option value="Insurance">Insurance</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Supplies">Supplies</option>
            <option value="Financial">Financial</option>
            <option value="Utilities">Utilities</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
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
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
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
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Login Credentials */}
        <div className="col-span-2 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Login Credentials</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.credentials?.username}
                onChange={(e) => setFormData({
                  ...formData,
                  credentials: { ...formData.credentials, username: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.credentials?.password}
                onChange={(e) => setFormData({
                  ...formData,
                  credentials: { ...formData.credentials, password: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Lab Fees Section - Only show for Laboratory category */}
        {formData.category === 'Laboratory' && (
          <div className="col-span-2 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Lab Fees</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFeeUpload(true)}
                >
                  <Icons.Upload className="w-4 h-4 mr-2" />
                  Import Fees
                </Button>
                <Button
                  type="button"
                  onClick={handleAddFee}
                  disabled={!newFee.code || !newFee.description || !newFee.fee}
                >
                  <Icons.Plus className="w-4 h-4 mr-2" />
                  Add Fee
                </Button>
              </div>
            </div>

            {/* New Fee Form */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                value={newFee.code}
                onChange={(e) => setNewFee({ ...newFee, code: e.target.value })}
                placeholder="Code"
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                value={newFee.description}
                onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                placeholder="Description"
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="number"
                value={newFee.fee}
                onChange={(e) => setNewFee({ ...newFee, fee: parseFloat(e.target.value) })}
                placeholder="Fee"
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="date"
                value={newFee.effectiveDate}
                onChange={(e) => setNewFee({ ...newFee, effectiveDate: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Fee List */}
            <div className="space-y-2">
              {formData.labFees?.map((fee, index) => (
                <div
                  key={fee.id}
                  className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg items-center"
                >
                  <div>{fee.code}</div>
                  <div>{fee.description}</div>
                  <div>${fee.fee.toFixed(2)}</div>
                  <div className="flex items-center justify-between">
                    <span>{new Date(fee.effectiveDate).toLocaleDateString()}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({
                        ...formData,
                        labFees: formData.labFees?.filter((_, i) => i !== index)
                      })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fee Upload Dialog */}
            {showFeeUpload && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                  <h3 className="text-lg font-medium mb-4">Import Fee Schedule</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a CSV file with columns: code, description, fee, effectiveDate
                  </p>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFeeUpload}
                      className="w-full"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowFeeUpload(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowFeeUpload(false)}
                      >
                        Import
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="col-span-2 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Notes</h3>
          <textarea
            value={formData.notes?.join('\n')}
            onChange={(e) => setFormData({
              ...formData,
              notes: e.target.value.split('\n').filter(note => note.trim())
            })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            rows={4}
            placeholder="Enter notes (one per line)..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="px-6 bg-gradient-to-r from-navy via-purple to-turquoise text-white"
          >
            {vendor ? 'Update' : 'Add'} Contact
          </Button>
        </div>
      </div>
    </form>
  );
};