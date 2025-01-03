import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import type { LabFee, Vendor } from '../types/vendor';

interface LabFeesManagerProps {
  vendor: Vendor;
  onUpdate: (fees: LabFee[]) => void;
}

export const LabFeesManager: React.FC<LabFeesManagerProps> = ({ vendor, onUpdate }) => {
  const [fees, setFees] = useState<LabFee[]>(vendor.labFees || []);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingFee, setEditingFee] = useState<string | null>(null);

  const handleAddFee = () => {
    const newFee: LabFee = {
      id: Date.now().toString(),
      code: '',
      description: '',
      fee: 0,
      effectiveDate: new Date().toISOString().split('T')[0]
    };
    setFees([...fees, newFee]);
  };

  const handleUpdateFee = (id: string, updates: Partial<LabFee>) => {
    const updatedFees = fees.map(fee => 
      fee.id === id ? { ...fee, ...updates } : fee
    );
    setFees(updatedFees);
    onUpdate(updatedFees);
    setEditingFee(null);
  };

  const handleDeleteFee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      const updatedFees = fees.filter(fee => fee.id !== id);
      setFees(updatedFees);
      onUpdate(updatedFees);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setImportData(text);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    try {
      // Assuming CSV format: code,description,fee,category,effectiveDate
      const rows = importData.split('\n').slice(1); // Skip header row
      const importedFees: LabFee[] = rows.map(row => {
        const [code, description, fee, category, effectiveDate] = row.split(',');
        return {
          id: Date.now().toString() + Math.random(),
          code: code.trim(),
          description: description.trim(),
          fee: parseFloat(fee),
          category: category?.trim(),
          effectiveDate: effectiveDate?.trim() || new Date().toISOString().split('T')[0]
        };
      });
      
      setFees([...fees, ...importedFees]);
      onUpdate([...fees, ...importedFees]);
      setShowImport(false);
      setImportData('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error importing fees:', error);
      alert('Error importing fees. Please check the file format.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lab Fees</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Icons.Upload className="w-4 h-4 mr-2" />
            Import Fees
          </Button>
          <Button onClick={handleAddFee}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Fee
          </Button>
        </div>
      </div>

      {/* Fee List */}
      <div className="space-y-3">
        {fees.map((fee) => (
          <div key={fee.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-5 gap-4 flex-1">
              <input
                type="text"
                value={fee.code}
                onChange={(e) => handleUpdateFee(fee.id, { code: e.target.value })}
                onFocus={() => setEditingFee(fee.id)}
                placeholder="Code"
                className="px-2 py-1 border border-gray-200 rounded"
              />
              <input
                type="text"
                value={fee.description}
                onChange={(e) => handleUpdateFee(fee.id, { description: e.target.value })}
                onFocus={() => setEditingFee(fee.id)}
                placeholder="Description"
                className="px-2 py-1 border border-gray-200 rounded col-span-2"
              />
              <input
                type="text"
                value={editingFee === fee.id ? fee.fee : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(fee.fee)}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  const numericValue = parseFloat(value) || 0;
                  handleUpdateFee(fee.id, { fee: numericValue });
                }}
                onBlur={() => setEditingFee(null)}
                onFocus={(e) => {
                  setEditingFee(fee.id);
                  e.target.value = fee.fee.toString();
                }}
                placeholder="Fee"
                className="px-2 py-1 border border-gray-200 rounded text-right"
              />
              <input
                type="date"
                value={fee.effectiveDate}
                onChange={(e) => handleUpdateFee(fee.id, { effectiveDate: e.target.value })}
                className="px-2 py-1 border border-gray-200 rounded"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fee.received}
                  onChange={(e) => handleUpdateFee(fee.id, { received: e.target.checked })}
                  className="rounded border-gray-300"
                  id={`received-${fee.id}`}
                />
                <label htmlFor={`received-${fee.id}`} className="text-sm text-gray-600">
                  Received
                </label>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDeleteFee(fee.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Import Dialog */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import Lab Fees</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowImport(false)}>
                <Icons.X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fee-import"
                />
                <label
                  htmlFor="fee-import"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'Click to upload CSV file'}
                  </span>
                </label>
              </div>

              <div className="text-sm text-gray-500">
                <p>CSV Format:</p>
                <code className="block bg-gray-50 p-2 rounded mt-1">
                  code,description,fee,category,effectiveDate
                </code>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImport(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!selectedFile}>
                  Import
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};