import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { useNotifications } from "../../contexts/NotificationContext";
import { cn } from "../../lib/utils";

interface NotificationBellProps {
  count: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  count,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useNotifications();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
      >
        <Icons.Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch({ type: "MARK_ALL_AS_READ" })}
                >
                  Mark all as read
                </Button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {state.notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                state.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-gray-100 hover:bg-gray-50",
                      !notification.read && "bg-blue-50/50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          notification.type === "task" && "bg-blue-100",
                          notification.type === "message" && "bg-green-100",
                          notification.type === "alert" && "bg-red-100",
                        )}
                      >
                        {notification.type === "task" && (
                          <Icons.CheckSquare className="w-4 h-4 text-blue-600" />
                        )}
                        {notification.type === "message" && (
                          <Icons.MessageSquare className="w-4 h-4 text-green-600" />
                        )}
                        {notification.type === "alert" && (
                          <Icons.AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
