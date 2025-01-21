import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'admin' | 'staff' | 'provider';
  permissions: Permission[];
  modules: ModulePermission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope?: 'global' | 'limited';
}

interface ModulePermission {
  id: string;
  name: string;
  access: 'none' | 'read' | 'write' | 'full';
  customFields?: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export const UserPermissions = () => {
  const [roles, setRoles] = React.useState<Role[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access',
      type: 'admin',
      permissions: [
        { id: '1', name: 'System Configuration', description: 'Manage system settings', enabled: true, scope: 'global' },
        { id: '2', name: 'User Management', description: 'Create and manage users', enabled: true, scope: 'global' },
        { id: '3', name: 'Financial Management', description: 'Full financial access', enabled: true, scope: 'global' },
        { id: '4', name: 'Audit Logs', description: 'View system audit logs', enabled: true, scope: 'global' },
        { id: '5', name: 'Security Settings', description: 'Manage security configurations', enabled: true, scope: 'global' }
      ],
      modules: [
        { id: '1', name: 'Dashboard', access: 'full' },
        { id: '2', name: 'Patients', access: 'full' },
        { id: '3', name: 'Appointments', access: 'full' },
        { id: '4', name: 'Billing', access: 'full' },
        { id: '5', name: 'Reports', access: 'full' }
      ]
    },
    {
      id: '2',
      name: 'Provider',
      description: 'Clinical staff access',
      type: 'provider',
      permissions: [
        { id: '1', name: 'Patient Records', description: 'Access patient records', enabled: true, scope: 'limited' },
        { id: '2', name: 'Treatment Plans', description: 'Create treatment plans', enabled: true, scope: 'limited' },
        { id: '3', name: 'Prescriptions', description: 'Write prescriptions', enabled: true, scope: 'limited' },
        { id: '4', name: 'Lab Orders', description: 'Order lab tests', enabled: true, scope: 'limited' }
      ],
      modules: [
        { id: '1', name: 'Dashboard', access: 'read' },
        { id: '2', name: 'Patients', access: 'write' },
        { id: '3', name: 'Appointments', access: 'write' },
        { id: '4', name: 'Billing', access: 'read' },
        { id: '5', name: 'Reports', access: 'read' }
      ]
    },
    {
      id: '3',
      name: 'Front Desk',
      description: 'Reception and scheduling',
      type: 'staff',
      permissions: [
        { id: '1', name: 'Appointment Scheduling', description: 'Manage appointments', enabled: true, scope: 'limited' },
        { id: '2', name: 'Patient Registration', description: 'Register new patients', enabled: true, scope: 'limited' },
        { id: '3', name: 'Insurance Verification', description: 'Verify insurance', enabled: true, scope: 'limited' }
      ],
      modules: [
        { id: '1', name: 'Dashboard', access: 'read' },
        { id: '2', name: 'Patients', access: 'write', customFields: { create: true, edit: true, delete: false } },
        { id: '3', name: 'Appointments', access: 'write' },
        { id: '4', name: 'Billing', access: 'read' },
        { id: '5', name: 'Reports', access: 'none' }
      ]
    }
  ]);

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: role.permissions.map(perm => {
            if (perm.id === permissionId) {
              return { ...perm, enabled: !perm.enabled };
            }
            return perm;
          })
        };
      }
      return role;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">User Permissions</h2>
        <Button>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="space-y-6">
        {roles.map((role) => (
          <div key={role.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
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
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Icons.Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4 text-sm font-medium text-gray-500">Permission</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Description</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Scope</th>
                    <th className="pb-4 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {role.permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td className="py-3">
                        <span className="font-medium text-gray-900">{permission.name}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-gray-500">{permission.description}</span>
                      </td>
                      <td className="py-3">
                        {permission.scope && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            permission.scope === 'global' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {permission.scope}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={permission.enabled}
                            onChange={() => togglePermission(role.id, permission.id)}
                          />
                          <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                            permission.enabled ? 'translate-x-6 bg-primary' : 'bg-white'
                          }`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Module Access</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {role.modules.map((module) => (
                  <div key={module.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{module.name}</span>
                      <select
                        value={module.access}
                        onChange={(e) => {
                          const newRoles = roles.map(r => {
                            if (r.id === role.id) {
                              return {
                                ...r,
                                modules: r.modules.map(m => {
                                  if (m.id === module.id) {
                                    return { ...m, access: e.target.value as typeof module.access };
                                  }
                                  return m;
                                })
                              };
                            }
                            return r;
                          });
                          setRoles(newRoles);
                        }}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                      >
                        <option value="none">No Access</option>
                        <option value="read">Read Only</option>
                        <option value="write">Read/Write</option>
                        <option value="full">Full Access</option>
                      </select>
                    </div>
                    {module.customFields && (
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={module.customFields.create}
                            onChange={(e) => {
                              const newRoles = roles.map(r => {
                                if (r.id === role.id) {
                                  return {
                                    ...r,
                                    modules: r.modules.map(m => {
                                      if (m.id === module.id && m.customFields) {
                                        return {
                                          ...m,
                                          customFields: { ...m.customFields, create: e.target.checked }
                                        };
                                      }
                                      return m;
                                    })
                                  };
                                }
                                return r;
                              });
                              setRoles(newRoles);
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">Create Records</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={module.customFields.edit}
                            onChange={(e) => {
                              const newRoles = roles.map(r => {
                                if (r.id === role.id) {
                                  return {
                                    ...r,
                                    modules: r.modules.map(m => {
                                      if (m.id === module.id && m.customFields) {
                                        return {
                                          ...m,
                                          customFields: { ...m.customFields, edit: e.target.checked }
                                        };
                                      }
                                      return m;
                                    })
                                  };
                                }
                                return r;
                              });
                              setRoles(newRoles);
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">Edit Records</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={module.customFields.delete}
                            onChange={(e) => {
                              const newRoles = roles.map(r => {
                                if (r.id === role.id) {
                                  return {
                                    ...r,
                                    modules: r.modules.map(m => {
                                      if (m.id === module.id && m.customFields) {
                                        return {
                                          ...m,
                                          customFields: { ...m.customFields, delete: e.target.checked }
                                        };
                                      }
                                      return m;
                                    })
                                  };
                                }
                                return r;
                              });
                              setRoles(newRoles);
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">Delete Records</span>
                        </label>
                      </div>
                    )}
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