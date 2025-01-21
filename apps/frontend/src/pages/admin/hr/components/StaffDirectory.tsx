import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { ViewProfileModal } from './staff/ViewProfileModal';
import { EditStaffModal } from './staff/EditStaffModal';
import { DeleteConfirmationModal } from './staff/DeleteConfirmationModal';
import { AddStaffModal } from './staff/AddStaffModal';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { ExportDialog } from './ExportDialog';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../../lib/utils/export';
import { StaffHRAccess } from './staff/StaffHRAccess';

export const StaffDirectory = () => {
  const [staff, setStaff] = React.useState([
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      role: 'Lead Dentist',
      department: 'Clinical',
      email: 'sarah.w@example.com',
      phone: '(555) 123-4567',
      status: 'active',
      startDate: '2020-01-15'
    },
    {
      id: '2',
      name: 'John Smith',
      role: 'Dental Hygienist',
      department: 'Clinical',
      email: 'john.s@example.com',
      phone: '(555) 234-5678',
      status: 'active',
      startDate: '2021-03-01'
    }
  ]);

  const [selectedStaff, setSelectedStaff] = React.useState<any>(null);
  const [showViewProfile, setShowViewProfile] = React.useState(false);
  const [showEditStaff, setShowEditStaff] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showAddStaff, setShowAddStaff] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [showHRAccess, setShowHRAccess] = React.useState(false);
  const [showAddEmployee, setShowAddEmployee] = React.useState(false);

  const { dispatch: notifyDispatch } = useNotifications();

  const handleEditStaff = (updatedStaff: any) => {
    setStaff(staff.map(member => 
      member.email === updatedStaff.email ? updatedStaff : member
    ));
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Staff Member Updated',
        message: `${updatedStaff.name}'s information has been updated`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  const handleDeleteStaff = (staffEmail: string) => {
    const staffMember = staff.find(s => s.email === staffEmail);
    setStaff(staff.filter(member => member.email !== staffEmail));
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'alert',
        title: 'Staff Member Removed',
        message: `${staffMember?.name} has been removed from the directory`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high'
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Staff Directory</h2>
          <p className="text-sm text-gray-500">View and manage staff members</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            <span onClick={() => setShowExportDialog(true)}>Export Directory</span>
          </Button>
          <Button size="sm" onClick={() => setShowAddEmployee(true)}>
            <Icons.UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>
      
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={(format, options) => {
          const exportData = staff.map(member => ({
            name: member.name,
            role: member.role,
            department: member.department,
            email: member.email,
            phone: member.phone,
            status: member.status,
            startDate: member.startDate
          }));

          if (format === 'csv') {
            exportToCSV(exportData, 'staff-directory');
          } else if (format === 'excel') {
            exportToExcel(exportData, 'staff-directory');
          } else if (format === 'pdf') {
            exportToPDF(exportData, 'staff-directory');
          }
        }}
      />

      <div className="space-y-4">
        {staff.map((member, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icons.User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                member.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              )}>
                {member.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{member.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{member.phone}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setSelectedStaff(member);
                  setShowHRAccess(true);
                }}
              >
                <Icons.FileText className="w-4 h-4 mr-2" />
                HR Files
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setSelectedStaff(member);
                  setShowViewProfile(true);
                }}
              >
                <Icons.FileText className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setSelectedStaff(member);
                  setShowEditStaff(true);
                }}
              >
                <Icons.Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 hover:text-red-700" 
                onClick={() => {
                  setSelectedStaff(member);
                  setShowDeleteConfirm(true);
                }}
              >
                <Icons.Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <ViewProfileModal
        isOpen={showViewProfile}
        onClose={() => {
          setShowViewProfile(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
      />
      
      <EditStaffModal
        isOpen={showEditStaff}
        onClose={() => {
          setShowEditStaff(false);
          setSelectedStaff(null);
        }}
        onSave={handleEditStaff}
        staff={selectedStaff}
      />
      
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedStaff(null);
        }}
        onConfirm={() => handleDeleteStaff(selectedStaff?.email)}
        staffName={selectedStaff?.name}
      />
      
      {/* Add Staff/Employee Modal - Used for both buttons */}
      <AddStaffModal
        isOpen={showAddStaff || showAddEmployee}
        onClose={() => {
          setShowAddStaff(false);
          setShowAddEmployee(false);
        }}
        onAdd={(staffMember) => {
          setStaff([...staff, { id: Date.now().toString(), ...staffMember }]);
          
          notifyDispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              type: 'message',
              title: 'New Staff Member Added',
              message: `${staffMember.name} has been added as ${staffMember.role}`,
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'medium'
            }
          });
          
          setShowAddStaff(false);
          setShowAddEmployee(false);
        }}
      />
      
      <StaffHRAccess
        isOpen={showHRAccess}
        staffId={selectedStaff?.id}
        onClose={() => {
          setShowHRAccess(false);
          setSelectedStaff(null);
        }}
      />
    </motion.div>
  );
};