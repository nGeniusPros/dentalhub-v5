import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import supabase from "../../../../../lib/supabase/client";
import { syncManager } from "../../../../../lib/utils/sync";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffMember: any) => void;
  staff: any;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  staff,
}) => {
  const [formData, setFormData] = useState<any>(
    staff || {
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      status: "active",
      startDate: "",
    },
  );

  // Update form data when staff prop changes
  useEffect(() => {
    if (staff) {
      setFormData(staff);
    }
  }, [staff]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await syncManager.addOperation({
        table: "staff_profiles",
        type: "UPDATE",
        data: {
          id: staff.id,
          role: formData.role,
          specialization: formData.department,
          contact_info: {
            phone: formData.phone,
          },
          status: formData.status,
        },
        timestamp: Date.now(),
      });
      console.log("Staff profile update queued");
    } catch (error) {
      console.error("Error queueing staff profile update:", error);
    }
    onSave(formData);
    onClose();
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
            <h2 className="text-xl font-semibold">Edit Staff Member</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              {React.createElement((Icons as any).X, {
                className: "w-5 h-5",
              })}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.user?.raw_user_meta_data?.full_name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user: {
                      ...formData.user,
                      raw_user_meta_data: {
                        ...formData.user.raw_user_meta_data,
                        full_name: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="Dentist">Dentist</option>
                <option value="Hygienist">Hygienist</option>
                <option value="Dental Assistant">Dental Assistant</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Office Manager">Office Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="Clinical">Clinical</option>
                <option value="Administrative">Administrative</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.user?.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user: { ...formData.user, email: e.target.value },
                  })
                }
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
                value={formData.contact_info?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_info: {
                      ...formData.contact_info,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
