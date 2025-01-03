import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { EmployeeForm } from '../components/staff/EmployeeForm';

const NewStaffPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (employeeData: any) => {
    // Handle employee creation
    console.log('Creating new employee:', employeeData);
    navigate('/admin-dashboard/hr');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            New Staff Member
          </h1>
          <p className="text-gray-600">Create a new employee record</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin-dashboard/hr')}>
          <Icons.X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <EmployeeForm
          isOpen={true}
          onClose={() => navigate('/admin-dashboard/hr')}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
};

export default NewStaffPage;