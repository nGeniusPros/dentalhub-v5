import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
}

export const StaffWelcome: React.FC = () => {
  const [staffInfo, setStaffInfo] = React.useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("staff_members")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setStaffInfo(data);
      } catch (error) {
        console.error("Error fetching staff info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Icons.Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {staffInfo?.avatar_url ? (
            <img
              src={staffInfo.avatar_url}
              alt={`${staffInfo.first_name} ${staffInfo.last_name}`}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icons.User className="h-6 w-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {staffInfo?.first_name || "Staff Member"}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {staffInfo?.role || "Staff"} • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icons.Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Icons.Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
