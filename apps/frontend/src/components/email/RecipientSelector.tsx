import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';

interface RecipientSelectorProps {
  onSelect: (criteria: any) => void;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  onSelect
}) => {
  const [selectionType, setSelectionType] = useState<'all' | 'segment' | 'list'>('all');
  const [criteria, setCriteria] = useState<Array<{
    field: string;
    operator: string;
    value: string;
  }>>([]);

  const addCriteria = () => {
    setCriteria([...criteria, { field: '', operator: '', value: '' }]);
  };

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const updateCriteria = (index: number, field: string, value: string) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setSelectionType('all')}
          className={`flex-1 p-4 rounded-lg border ${
            selectionType === 'all'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <h3 className="font-medium text-gray-900">All Patients</h3>
          <p className="text-sm text-gray-500">Send to all active patients</p>
        </button>
        <button
          onClick={() => setSelectionType('segment')}
          className={`flex-1 p-4 rounded-lg border ${
            selectionType === 'segment'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <h3 className="font-medium text-gray-900">Patient Segment</h3>
          <p className="text-sm text-gray-500">Select based on criteria</p>
        </button>
        <button
          onClick={() => setSelectionType('list')}
          className={`flex-1 p-4 rounded-lg border ${
            selectionType === 'list'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <h3 className="font-medium text-gray-900">Custom List</h3>
          <p className="text-sm text-gray-500">Upload or select patients</p>
        </button>
      </div>

      {selectionType === 'segment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Segment Criteria</h3>
            <Button variant="outline" onClick={addCriteria}>
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add Criteria
            </Button>
          </div>

          {criteria.map((criterion, index) => (
            <div key={index} className="flex gap-4 items-center">
              <select
                value={criterion.field}
                onChange={(e) => updateCriteria(index, 'field', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select field...</option>
                <optgroup label="Patient Info">
                  <option value="age">Age</option>
                  <option value="gender">Gender</option>
                  <option value="location">Location</option>
                </optgroup>
                <optgroup label="Clinical">
                  <option value="lastVisit">Last Visit</option>
                  <option value="nextRecall">Next Recall</option>
                  <option value="treatment">Treatment Status</option>
                </optgroup>
                <optgroup label="Financial">
                  <option value="insurance">Insurance</option>
                  <option value="balance">Account Balance</option>
                </optgroup>
              </select>

              <select
                value={criterion.operator}
                onChange={(e) => updateCriteria(index, 'operator', e.target.value)}
                className="w-40 px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Operator...</option>
                <option value="equals">Equals</option>
                <option value="notEquals">Does not equal</option>
                <option value="contains">Contains</option>
                <option value="greaterThan">Greater than</option>
                <option value="lessThan">Less than</option>
              </select>

              <input
                type="text"
                value={criterion.value}
                onChange={(e) => updateCriteria(index, 'value', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Value"
              />

              <Button
                variant="ghost"
                onClick={() => removeCriteria(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Icons.Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {selectionType === 'list' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <Icons.Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-4 text-center">
                Drag and drop your patient list here, or click to browse.<br />
                Supported formats: CSV, Excel
              </p>
              <Button variant="outline">
                Browse Files
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => onSelect({ type: selectionType, criteria })}>
          Continue
        </Button>
      </div>
    </div>
  );
};