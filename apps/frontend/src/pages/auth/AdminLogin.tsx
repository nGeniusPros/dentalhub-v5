import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/supabase";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLocalError(null);
      if (isRegistering) {
        setLocalError(
          "Admin registration is disabled. Please contact support.",
        );
        return;
      }

      await signIn(email, password);

      // Check if the user has the admin role
      const { user } = await api.auth.getUser().then(({ data }) => data);
      if (user?.user_metadata?.role !== "admin") {
        setLocalError("Access denied. Admin access only.");
        await api.auth.signOut();
        return;
      }

      navigate("/admin");
    } catch (err) {
      console.error("Authentication failed:", err);
      setLocalError("Authentication failed. Please check your credentials.");
    }
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
              ease: "linear",
            }}
            className="w-16 h-16"
          >
            <Icons.Shield className="w-full h-full text-[#1B2B85]" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] text-transparent bg-clip-text">
          Admin Login
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Welcome back! Please enter your credentials.
        </p>

        {localError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B2B85] focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B2B85] focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg bg-[#1B2B85] text-white font-medium hover:bg-[#1B2B85]/90 focus:outline-none focus:ring-2 focus:ring-[#1B2B85] focus:ring-offset-2 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
