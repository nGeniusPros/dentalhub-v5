import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserProfile } from "./UserProfile";

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-8 h-8"
            >
              <Icons.Heart className="w-full h-full text-[#1B2B85]" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] text-transparent bg-clip-text">
              DentalHub
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfile />
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
