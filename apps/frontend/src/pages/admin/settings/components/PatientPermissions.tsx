import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface PatientPermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: PatientPermission[];
}

interface PatientPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  customizable?: boolean;
}

export const PatientPermissions = () => {
  const [permissionGroups, setPermissionGroups] = React.useState<
    PatientPermissionGroup[]
  >([
    {
      id: "1",
      name: "Medical Records",
      description: "Access to medical records and history",
      permissions: [
        {
          id: "1",
          name: "View Own Records",
          description: "View personal medical records",
          enabled: true,
          customizable: false,
        },
        {
          id: "2",
          name: "Download Records",
          description: "Download medical records",
          enabled: true,
        },
        {
          id: "3",
          name: "Share Records",
          description: "Share records with other providers",
          enabled: false,
        },
      ],
    },
    {
      id: "2",
      name: "Family Access",
      description: "Manage family member access",
      permissions: [
        {
          id: "4",
          name: "Add Family Members",
          description: "Add new family members to account",
          enabled: true,
        },
        {
          id: "5",
          name: "View Family Records",
          description: "Access family members' records",
          enabled: true,
        },
        {
          id: "6",
          name: "Manage Family Appointments",
          description: "Schedule appointments for family",
          enabled: true,
        },
      ],
    },
    {
      id: "3",
      name: "Financial",
      description: "Financial and billing permissions",
      permissions: [
        {
          id: "7",
          name: "View Bills",
          description: "View billing statements",
          enabled: true,
          customizable: false,
        },
        {
          id: "8",
          name: "Make Payments",
          description: "Process payments online",
          enabled: true,
        },
        {
          id: "9",
          name: "Setup Payment Plans",
          description: "Create custom payment plans",
          enabled: false,
        },
      ],
    },
    {
      id: "4",
      name: "Communication",
      description: "Communication preferences",
      permissions: [
        {
          id: "10",
          name: "Appointment Reminders",
          description: "Receive appointment reminders",
          enabled: true,
        },
        {
          id: "11",
          name: "Treatment Updates",
          description: "Receive treatment updates",
          enabled: true,
        },
        {
          id: "12",
          name: "Marketing Communications",
          description: "Receive promotional content",
          enabled: false,
        },
      ],
    },
  ]);

  const togglePermission = (groupId: string, permissionId: string) => {
    setPermissionGroups((groups) =>
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            permissions: group.permissions.map((perm) => {
              if (perm.id === permissionId && perm.customizable !== false) {
                return { ...perm, enabled: !perm.enabled };
              }
              return perm;
            }),
          };
        }
        return group;
      }),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Patient Portal Permissions</h2>
          <p className="text-sm text-gray-500">
            Configure default permissions for patient portal users
          </p>
        </div>
        <Button>
          <Icons.Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {permissionGroups.map((group) => (
          <div
            key={group.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.description}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {group.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {permission.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {permission.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {permission.customizable === false && (
                        <span className="text-xs text-gray-500">Required</span>
                      )}
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={permission.enabled}
                          onChange={() =>
                            togglePermission(group.id, permission.id)
                          }
                          disabled={permission.customizable === false}
                        />
                        <div
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                            permission.enabled
                              ? "translate-x-6 bg-primary"
                              : "bg-white"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
