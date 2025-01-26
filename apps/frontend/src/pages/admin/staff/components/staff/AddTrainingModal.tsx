import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";

interface AddTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (training: any) => void;
}

export const AddTrainingModal: React.FC<AddTrainingModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [training, setTraining] = useState({
    title: "",
    description: "",
    type: "course",
    category: "",
    duration: "",
    dueDate: "",
    required: false,
    assignees: [] as string[],
    materials: [] as { name: string; type: string; url: string }[],
    redirectToLearning: false,
  });

  const [currentAssignee, setCurrentAssignee] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(training);
    onClose();
  };

  const handleAddAssignee = () => {
    if (currentAssignee && !training.assignees.includes(currentAssignee)) {
      setTraining({
        ...training,
        assignees: [...training.assignees, currentAssignee],
      });
      setCurrentAssignee("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Training</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Title
              </label>
              <input
                type="text"
                value={training.title}
                onChange={(e) =>
                  setTraining({ ...training, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={training.description}
                onChange={(e) =>
                  setTraining({ ...training, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Type
              </label>
              <select
                value={training.type}
                onChange={(e) =>
                  setTraining({ ...training, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="course">Course</option>
                <option value="workshop">Workshop</option>
                <option value="certification">Certification</option>
                <option value="assessment">Assessment</option>
                <option value="onboarding">Onboarding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={training.category}
                onChange={(e) =>
                  setTraining({ ...training, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select category...</option>
                <option value="clinical">Clinical Skills</option>
                <option value="compliance">Compliance</option>
                <option value="safety">Safety</option>
                <option value="soft-skills">Soft Skills</option>
                <option value="technical">Technical</option>
                <option value="onboarding">Onboarding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={training.duration}
                onChange={(e) =>
                  setTraining({ ...training, duration: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g., 2 hours"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={training.dueDate}
                onChange={(e) =>
                  setTraining({ ...training, dueDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentAssignee}
                  onChange={(e) => setCurrentAssignee(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Enter staff member name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAssignee();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddAssignee}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {training.assignees.map((assignee, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {assignee}
                    <button
                      type="button"
                      onClick={() =>
                        setTraining({
                          ...training,
                          assignees: training.assignees.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Training Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Materials
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <Icons.Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop training materials here, or click to browse
                </p>
                <Button type="button" variant="outline">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={training.required}
                onChange={(e) =>
                  setTraining({ ...training, required: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm">Required Training</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={training.redirectToLearning}
                onChange={(e) =>
                  setTraining({
                    ...training,
                    redirectToLearning: e.target.checked,
                  })
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm">Continue setup in Learning Center</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !training.title || !training.description || !training.dueDate
              }
            >
              Add Training
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
