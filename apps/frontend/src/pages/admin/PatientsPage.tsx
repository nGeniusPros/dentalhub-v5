import React from 'react';
import { motion } from 'framer-motion';
import { PatientsList } from '../../components/PatientsList';

export const PatientsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <PatientsList />
      </motion.div>
    </div>
  );
};
