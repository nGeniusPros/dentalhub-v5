import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabaseService } from '../../services/supabase';
import type { Database } from '../../types/database.types';

type StaffProfile = Database['public']['Tables']['staff_profiles']['Row'] & {
  user: {
    id: string;
    email: string;
    raw_user_meta_data: Record<string, any>;
  };
};

export const StaffWelcome = () => {
  const { user } = useAuth();
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);

  useEffect(() => {
    const fetchStaffProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabaseService
            .from('staff_profiles')
            .select(`
              *,
              user:auth.users!user_id(
                id,
                email,
                raw_user_meta_data
              )
            `)
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching staff profile:', error);
          } else {
            setStaffProfile(data);
          }
        } catch (error) {
          console.error('Error fetching staff profile:', error);
        }
      }
    };

    fetchStaffProfile();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1B2B85] to-[#3B4AB9] text-transparent bg-clip-text">
          Staff Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {staffProfile?.user?.raw_user_meta_data?.name || 'Staff Member'}!
        </p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-gradient-to-r from-[#1B2B85]/10 to-[#3B4AB9]/10"
      >
        <Icons.Bell className="w-6 h-6 text-[#1B2B85]" />
      </motion.div>
    </motion.div>
  );
};