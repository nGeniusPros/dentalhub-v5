import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { format } from 'date-fns';

export const PatientsList = () => {
  const {
    patients,
    isLoading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    refresh
  } = usePatients({ pageSize: 10 });

  const totalPages = Math.ceil(totalCount / 10);

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
          Patients ({totalCount})
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refresh}
            className="p-2 text-navy hover:text-purple transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-navy via-purple to-turquoise text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <UserPlus className="w-5 h-5" />
            Add Patient
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refresh}
            className="text-navy hover:text-purple transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      )}

      {/* Patients Table */}
      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600">Date of Birth</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {patients.map((patient) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer group"
                  >
                    <td className="py-4">
                      <div className="font-medium text-navy group-hover:text-purple transition-colors">
                        {patient.first_name} {patient.last_name}
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{patient.email}</td>
                    <td className="py-4 text-gray-600">{formatPhoneNumber(patient.phone)}</td>
                    <td className="py-4 text-gray-600">
                      {format(new Date(patient.date_of_birth), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-navy hover:text-purple transition-colors"
                        >
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-navy hover:text-purple transition-colors"
                        >
                          Edit
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} patients
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 text-navy hover:text-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            {[...Array(totalPages)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full ${
                  currentPage === i + 1
                    ? 'bg-purple text-white'
                    : 'text-navy hover:text-purple'
                } transition-colors`}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 text-navy hover:text-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
