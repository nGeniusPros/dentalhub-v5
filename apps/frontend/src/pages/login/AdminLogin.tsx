import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle authentication here
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B2B85]/5 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow-lg border border-[#1B2B85]/10 w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-16 h-16"
          >
            <Icons.Atom className="w-full h-full text-[#1B2B85]" />
          </motion.div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] text-transparent bg-clip-text">
          Admin Login
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Access your administrative dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2B85]/20 focus:border-[#1B2B85]"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B2B85]/20 focus:border-[#1B2B85]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-[#1B2B85] hover:underline">
            Forgot your password?
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;