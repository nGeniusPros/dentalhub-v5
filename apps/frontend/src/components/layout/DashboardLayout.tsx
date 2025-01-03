import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  role?: "admin" | "staff" | "patient";
}

const DashboardLayout = ({ role = "staff" }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto p-8 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}>
            <Outlet />
          </motion.div>
        </main>

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute w-[1000px] h-[1000px] blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(27,43,133,0.1) 0%, transparent 70%)',
              top: '0%',
              right: '0%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-[800px] h-[800px] blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(64,224,208,0.1) 0%, transparent 70%)',
              bottom: '0%',
              left: '0%',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;