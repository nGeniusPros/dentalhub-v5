import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentGridProps {
  onAgentSelect: (agentId: string) => void;
  activeAgent?: string;
}

const agents = [
  {
    id: "head-brain",
    name: "Head Brain Consultant",
    description: "Orchestrates and coordinates all other agents",
    icon: "🧠",
    category: "core",
  },
  {
    id: "data-retrieval",
    name: "Data Retrieval",
    description: "Validates and synchronizes practice data",
    icon: "💾",
    category: "core",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Analyzes KPIs and identifies trends",
    icon: "📊",
    category: "core",
  },
  {
    id: "revenue-agent",
    name: "Revenue Agent",
    description: "Financial performance tracking",
    icon: "💰",
    category: "financial",
  },
  {
    id: "procedure-codes",
    name: "Procedure Codes",
    description: "Optimizes code utilization and compliance",
    icon: "📋",
    category: "financial",
  },
  {
    id: "patient-care",
    name: "Patient Care",
    description: "Monitors patient satisfaction and care quality",
    icon: "👥",
    category: "clinical",
  },
  {
    id: "lab-case",
    name: "Lab Case Manager",
    description: "Tracks lab cases and quality control",
    icon: "🔬",
    category: "clinical",
  },
  {
    id: "hygiene",
    name: "Hygiene Analytics",
    description: "Monitors hygiene department performance",
    icon: "🦷",
    category: "clinical",
  },
  {
    id: "operations",
    name: "Operations",
    description: "Optimizes practice workflow and efficiency",
    icon: "⚙️",
    category: "operations",
  },
  {
    id: "marketing",
    name: "Marketing ROI",
    description: "Campaign ROI tracking",
    icon: "📢",
    category: "growth",
  },
];

const categories = {
  core: { name: "Core Agents", color: "bg-blue-500" },
  financial: { name: "Financial", color: "bg-green-500" },
  clinical: { name: "Clinical", color: "bg-purple-500" },
  operations: { name: "Operations", color: "bg-orange-500" },
  growth: { name: "Growth", color: "bg-pink-500" },
};

export const AgentGrid: React.FC<AgentGridProps> = ({
  onAgentSelect,
  activeAgent,
}) => {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={gridVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Object.entries(categories).map(([categoryId, category]) => (
          <div key={categoryId} className="space-y-4">
            <h3
              className={cn(
                "text-sm font-semibold px-3 py-1 rounded-full w-fit",
                category.color,
                "text-white",
              )}
            >
              {category.name}
            </h3>
            <div className="grid gap-3">
              {agents
                .filter((agent) => agent.category === categoryId)
                .map((agent) => (
                  <motion.div
                    key={agent.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAgentSelect(agent.id)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer",
                      "hover:shadow-md transition-all duration-200",
                      "bg-white dark:bg-gray-800",
                      activeAgent === agent.id ? "ring-2 ring-blue-500" : "",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{agent.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm">{agent.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
