import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface BackOfficeRole {
  id: string;
  name: string;
  description: string;
  permissions: BackOfficePermission[];
  accessLevels: AccessLevel[];
}

interface BackOfficePermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope?: "department" | "practice" | "limited";
}

interface AccessLevel {
  moduleId: string;
  moduleName: string;
  access: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve?: boolean;
  };
}

export const BackOfficePermissions = () => {
  const [roles, setRoles] = React.useState<BackOfficeRole[]>([
    {
      id: "1",
      name: "Lab Manager",
      description: "Manages laboratory cases and workflows",
      permissions: [
        {
          id: "1",
          name: "Lab Case Management",
          description: "Create and manage lab cases",
          enabled: true,
          scope: "practice",
        },
        {
          id: "2",
          name: "Lab Vendor Communication",
          description: "Communicate with lab vendors",
          enabled: true,
          scope: "practice",
        },
        {
          id: "3",
          name: "Quality Control",
          description: "Review and approve lab work",
          enabled: true,
          scope: "department",
        },
      ],
      accessLevels: [
        {
          moduleId: "lab_cases",
          moduleName: "Lab Cases",
          access: {
            view: true,
            create: true,
            edit: true,
            delete: false,
            approve: true,
          },
        },
        {
          moduleId: "lab_inventory",
          moduleName: "Lab Inventory",
          access: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
      ],
    },
    {
      id: "2",
      name: "Supply Chain Coordinator",
      description: "Manages inventory and supplies",
      permissions: [
        {
          id: "4",
          name: "Inventory Management",
          description: "Manage practice supplies",
          enabled: true,
          scope: "practice",
        },
        {
          id: "5",
          name: "Vendor Management",
          description: "Manage supplier relationships",
          enabled: true,
          scope: "practice",
        },
        {
          id: "6",
          name: "Purchase Orders",
          description: "Create and approve orders",
          enabled: true,
          scope: "department",
        },
      ],
      accessLevels: [
        {
          moduleId: "inventory",
          moduleName: "Inventory",
          access: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
        {
          moduleId: "purchase_orders",
          moduleName: "Purchase Orders",
          access: {
            view: true,
            create: true,
            edit: true,
            delete: false,
            approve: true,
          },
        },
      ],
    },
    {
      id: "3",
      name: "Clinical Coordinator",
      description: "Manages clinical operations support",
      permissions: [
        {
          id: "7",
          name: "Patient Communication",
          description: "Contact patients for clinical matters",
          enabled: true,
          scope: "department",
        },
        {
          id: "8",
          name: "Clinical Documentation",
          description: "Access and manage clinical records",
          enabled: true,
          scope: "limited",
        },
        {
          id: "9",
          name: "Department Coordination",
          description: "Coordinate between departments",
          enabled: true,
          scope: "practice",
        },
      ],
      accessLevels: [
        {
          moduleId: "clinical_records",
          moduleName: "Clinical Records",
          access: {
            view: true,
            create: false,
            edit: true,
            delete: false,
          },
        },
        {
          moduleId: "patient_communication",
          moduleName: "Patient Communication",
          access: {
            view: true,
            create: true,
            edit: true,
            delete: false,
          },
        },
      ],
    },
  ]);

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: role.permissions.map((perm) => {
              if (perm.id === permissionId) {
                return { ...perm, enabled: !perm.enabled };
              }
              return perm;
            }),
          };
        }
        return role;
      }),
    );
  };

  const toggleAccess = (
    roleId: string,
    moduleId: string,
    accessType: keyof AccessLevel["access"],
  ) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            accessLevels: role.accessLevels.map((level) => {
              if (level.moduleId === moduleId) {
                return {
                  ...level,
                  access: {
                    ...level.access,
                    [accessType]: !level.access[accessType],
                  },
                };
              }
              return level;
            }),
          };
        }
        return role;
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
          <h2 className="text-lg font-semibold">
            Back Office Staff Permissions
          </h2>
          <p className="text-sm text-gray-500">
            Configure permissions for back office and clinical support staff
          </p>
        </div>
        <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="space-y-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icons.Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icons.Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
              <div className="space-y-4">
                {role.permissions.map((permission) => (
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
                      {permission.scope && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            permission.scope === "practice"
                              ? "bg-purple-100 text-purple-800"
                              : permission.scope === "department"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {permission.scope}
                        </span>
                      )}
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={permission.enabled}
                          onChange={() =>
                            togglePermission(role.id, permission.id)
                          }
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

            <div className="p-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">
                Module Access Levels
              </h4>
              <div className="space-y-4">
                {role.accessLevels.map((level) => (
                  <div
                    key={level.moduleId}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">
                        {level.moduleName}
                      </h5>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={level.access.view}
                          onChange={() =>
                            toggleAccess(role.id, level.moduleId, "view")
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">View</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={level.access.create}
                          onChange={() =>
                            toggleAccess(role.id, level.moduleId, "create")
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Create</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={level.access.edit}
                          onChange={() =>
                            toggleAccess(role.id, level.moduleId, "edit")
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Edit</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={level.access.delete}
                          onChange={() =>
                            toggleAccess(role.id, level.moduleId, "delete")
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Delete</span>
                      </label>
                      {level.access.approve !== undefined && (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={level.access.approve}
                            onChange={() =>
                              toggleAccess(role.id, level.moduleId, "approve")
                            }
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">Approve</span>
                        </label>
                      )}
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
