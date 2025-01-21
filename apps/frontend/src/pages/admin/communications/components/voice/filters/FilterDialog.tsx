import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../../components/ui/button';

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onApply
}) => {
  const [filters, setFilters] = React.useState({
    outcome: [] as string[],
    duration: 'all',
    status: [] as string[]
  });

  if (!open) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filter Results</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Call Outcome</h3>
            <div className="space-y-2">
              {['Appointment Scheduled', 'Call Back Later', 'Not Interested', 'Voicemail'].map((outcome) => (
                <label key={outcome} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.outcome.includes(outcome)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          outcome: [...prev.outcome, outcome]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          outcome: prev.outcome.filter(o => o !== outcome)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{outcome}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
            <select
              value={filters.duration}
              onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="space-y-2">
              {['Completed', 'Failed', 'Answered'].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          status: [...prev.status, status]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          status: prev.status.filter(s => s !== status)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setFilters({ outcome: [], duration: 'all', status: [] });
              }}
            >
              Reset
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};