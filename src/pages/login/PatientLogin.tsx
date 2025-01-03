import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const PatientLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle authentication here
    navigate('/patient-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ngenius-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg border border-ngenius-gray-200 w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <img src="/ngenius-logo.svg" alt="Ngenius" className="h-16" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-navy text-transparent bg-clip-text">
          Patient Login
        </h1>
        <p className="text-ngenius-gray-500 text-center mb-8">
          Access your patient portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ngenius-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ngenius-gray-400" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2 border border-ngenius-gray-200 rounded-lg focus:ring-2 focus:ring-ngenius-primary/20 focus:border-ngenius-primary"
                placeholder="patient@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ngenius-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ngenius-gray-400" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-2 border border-ngenius-gray-200 rounded-lg focus:ring-2 focus:ring-ngenius-primary/20 focus:border-ngenius-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-navy text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <a href="#" className="block text-sm text-ngenius-primary hover:underline">
            Forgot your password?
          </a>
          <a href="#" className="block text-sm text-ngenius-primary hover:underline">
            New patient? Register here
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientLogin;