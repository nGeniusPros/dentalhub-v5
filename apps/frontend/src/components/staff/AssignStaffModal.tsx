import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignments: any) => void;
  currentAssignments?: any[];
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  currentAssignments = []
}) => {
  const { dispatch: notifyDispatch } = useNotifications();
  const [assignments, setAssignments] = useState<any[]>(currentAssignments);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    availability: ''
  });

  const staffMembers = [
    { id: '1', name: 'Dr. Sarah Wilson', role: 'Lead Dentist', department: 'Clinical', availability: 'Full-time' },
    { id: '2', name: 'John Smith', role: 'Dental Hygienist', department: 'Clinical', availability: 'Part-time' },
    { id: '3', name: 'Emily Parker', role: 'Front Desk', department: 'Administrative', availability: 'Full-time' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssignments = selectedStaff.map(staffId => ({
      staffId,
      assignedAt: new Date().toISOString(),
      status: 'pending'
    }));

    onAssign(newAssignments);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Staff Assigned',
        message: `Successfully assigned ${selectedStaff.length} staff member${selectedStaff.length === 1 ? '' : 's'}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });

    onClose();
  };

  if (!isOpen) return null;

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !filters.department || staff.department === filters.department;
    const matchesRole = !filters.role || staff.role === filters.role;
    const matchesAvailability = !filters.availability || staff.availability === filters.availability;

    return matchesSearch && matchesDepartment && matchesRole && matchesAvailability;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Assign Staff</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name or role..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Departments</option>
                <option value="Clinical">Clinical</option>
                <option value="Administrative">Administrative</option>
                <option value="Management">Management</option>
              </select>

              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Roles</option>
                <option value="Lead Dentist">Lead Dentist</option>
                <option value="Dental Hygienist">Dental Hygienist</option>
                <option value="Front Desk">Front Desk</option>
              </select>

              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">All Availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          {/* Staff List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg transition-colors",
                  selectedStaff.includes(staff.id)
                    ? "bg-primary/10 border border-primary"
                    : "bg-gray-50 border border-transparent hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(staff.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStaff([...selectedStaff, staff.id]);
                      } else {
                        setSelectedStaff(selectedStaff.filter(id => id !== staff.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <p className="text-sm text-gray-500">{staff.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{staff.department}</span>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    staff.availability === 'Full-time' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  )}>
                    {staff.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedStaff.length} staff member{selectedStaff.length === 1 ? '' : 's'} selected
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedStaff.length === 0}
            >
              Assign Selected Staff
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};