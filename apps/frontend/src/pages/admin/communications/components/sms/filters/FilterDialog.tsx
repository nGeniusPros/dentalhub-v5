import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../../components/ui/button";

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = React.useState({
    status: [] as string[],
    type: [] as string[],
    audience: [] as string[],
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
          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="space-y-2">
              {["Active", "Scheduled", "Completed", "Paused"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters((prev) => ({
                          ...prev,
                          status: [...prev.status, status],
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          status: prev.status.filter((s) => s !== status),
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

          {/* Campaign Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Campaign Type
            </h3>
            <div className="space-y-2">
              {["Appointment", "Reminder", "Follow-up", "Promotion"].map(
                (type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters((prev) => ({
                            ...prev,
                            type: [...prev.type, type],
                          }));
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            type: prev.type.filter((t) => t !== type),
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          {/* Audience Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Audience</h3>
            <div className="space-y-2">
              {[
                "All Patients",
                "Active Patients",
                "Inactive Patients",
                "Custom Segment",
              ].map((audience) => (
                <label key={audience} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.audience.includes(audience)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters((prev) => ({
                          ...prev,
                          audience: [...prev.audience, audience],
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          audience: prev.audience.filter((a) => a !== audience),
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{audience}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ status: [], type: [], audience: [] });
              }}
            >
              Reset
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
