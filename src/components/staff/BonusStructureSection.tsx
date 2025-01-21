import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';

interface BonusStructureProps {
  value: {
    enrolled: boolean;
    type: string;
    frequency: string;
    targets: Array<{
      metric: string;
      target: number;
      bonus: number;
    }>;
    customPayoutDates?: string[];
    notes?: string;
  };
  onChange: (value: any) => void;
}

export const BonusStructureSection: React.FC<BonusStructureProps> = ({
  value,
  onChange
}) => {
  const handleAddTarget = () => {
    onChange({
      ...value,
      targets: [
        ...value.targets,
        { metric: '', target: 0, bonus: 0 }
      ]
    });
  };

  const handleRemoveTarget = (index: number) => {
    const newTargets = value.targets.filter((_, i) => i !== index);
    onChange({ ...value, targets: newTargets });
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium mb-4">Bonus Structure</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.enrolled}
              onChange={(e) => onChange({ ...value, enrolled: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Enroll in Bonus Program</span>
          </label>
        </div>

        {value.enrolled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus Type
                </label>
                <select
                  value={value.type}
                  onChange={(e) => onChange({ ...value, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="production">Production Based</option>
                  <option value="collection">Collection Based</option>
                  <option value="performance">Performance Based</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payout Frequency
                </label>
                <select
                  value={value.frequency}
                  onChange={(e) => onChange({ ...value, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biannual">Bi-Annual</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>
            </div>

            {value.frequency === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Payout Dates
                </label>
                <div className="flex flex-wrap gap-2">
                  {value.customPayoutDates?.map((date, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{date}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newDates = value.customPayoutDates?.filter((_, i) => i !== index);
                          onChange({ ...value, customPayoutDates: newDates });
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Icons.X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const date = prompt('Enter payout date (MM/DD):');
                      if (date) {
                        onChange({
                          ...value,
                          customPayoutDates: [...(value.customPayoutDates || []), date]
                        });
                      }
                    }}
                  >
                    <Icons.Plus className="w-4 h-4 mr-2" />
                    Add Date
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Bonus Targets</h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddTarget}>
                  <Icons.Plus className="w-4 h-4 mr-2" />
                  Add Target
                </Button>
              </div>

              {value.targets.map((target, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metric
                    </label>
                    <input
                      type="text"
                      value={target.metric}
                      onChange={(e) => {
                        const newTargets = [...value.targets];
                        newTargets[index] = { ...target, metric: e.target.value };
                        onChange({ ...value, targets: newTargets });
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g., Production"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target
                    </label>
                    <input
                      type="number"
                      value={target.target}
                      onChange={(e) => {
                        const newTargets = [...value.targets];
                        newTargets[index] = { ...target, target: Number(e.target.value) };
                        onChange({ ...value, targets: newTargets });
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="Target value"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bonus Amount
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={target.bonus}
                        onChange={(e) => {
                          const newTargets = [...value.targets];
                          newTargets[index] = { ...target, bonus: Number(e.target.value) };
                          onChange({ ...value, targets: newTargets });
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        placeholder="Bonus amount"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTarget(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={value.notes}
                onChange={(e) => onChange({ ...value, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                placeholder="Enter any additional notes about the bonus structure..."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};