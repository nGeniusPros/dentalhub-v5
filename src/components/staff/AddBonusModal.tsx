import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface AddBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bonus: any) => void;
  staffId: string;
  staffName: string;
}

export const AddBonusModal: React.FC<AddBonusModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  staffId,
  staffName
}) => {
  const [bonus, setBonus] = useState({
    type: 'performance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    recurring: false,
    frequency: 'one-time',
    endDate: '',
    metrics: [] as { metric: string; target: string; achieved: string }[]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...bonus,
      staffId,
      amount: parseFloat(bonus.amount),
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  const addMetric = () => {
    setBonus(prev => ({
      ...prev,
      metrics: [...prev.metrics, { metric: '', target: '', achieved: '' }]
    }));
  };

  const removeMetric = (index: number) => {
    setBonus(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Add Bonus</h2>
              <p className="text-sm text-gray-500">Adding bonus for {staffName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus Type
              </label>
              <select
                value={bonus.type}
                onChange={(e) => setBonus({ ...bonus, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="performance">Performance Bonus</option>
                <option value="holiday">Holiday Bonus</option>
                <option value="referral">Referral Bonus</option>
                <option value="retention">Retention Bonus</option>
                <option value="spot">Spot Bonus</option>
                <option value="commission">Commission</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <Icons.DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={bonus.amount}
                  onChange={(e) => setBonus({ ...bonus, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={bonus.date}
                onChange={(e) => setBonus({ ...bonus, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={bonus.frequency}
                onChange={(e) => setBonus({ ...bonus, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="one-time">One Time</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          {bonus.frequency !== 'one-time' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={bonus.endDate}
                onChange={(e) => setBonus({ ...bonus, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason / Notes
            </label>
            <textarea
              value={bonus.reason}
              onChange={(e) => setBonus({ ...bonus, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={3}
              required
            />
          </div>

          {/* Performance Metrics */}
          {bonus.type === 'performance' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Performance Metrics
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMetric}
                >
                  <Icons.Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
              </div>
              <div className="space-y-3">
                {bonus.metrics.map((metric, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={metric.metric}
                      onChange={(e) => {
                        const newMetrics = [...bonus.metrics];
                        newMetrics[index].metric = e.target.value;
                        setBonus({ ...bonus, metrics: newMetrics });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="Metric"
                    />
                    <input
                      type="text"
                      value={metric.target}
                      onChange={(e) => {
                        const newMetrics = [...bonus.metrics];
                        newMetrics[index].target = e.target.value;
                        setBonus({ ...bonus, metrics: newMetrics });
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="Target"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={metric.achieved}
                        onChange={(e) => {
                          const newMetrics = [...bonus.metrics];
                          newMetrics[index].achieved = e.target.value;
                          setBonus({ ...bonus, metrics: newMetrics });
                        }}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                        placeholder="Achieved"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMetric(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Bonus
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};