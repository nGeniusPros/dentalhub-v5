import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../components/ui/button";
import StatsCard from "../../../components/dashboard/StatsCard";
import { useNotifications } from "../../../contexts/NotificationContext";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
  active: boolean;
}

export const MembershipPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { dispatch: notifyDispatch } = useNotifications();

  const [plans, setPlans] = useState<MembershipPlan[]>([
    {
      id: "1",
      name: "Basic Plan",
      description: "Essential dental care coverage",
      price: 29.99,
      features: ["Regular checkups", "Basic cleanings", "X-rays"],
      duration: "monthly",
      active: true,
    },
    {
      id: "2",
      name: "Premium Plan",
      description: "Comprehensive dental care coverage",
      price: 49.99,
      features: [
        "Regular checkups",
        "Deep cleanings",
        "X-rays",
        "Fillings",
        "Emergency care",
      ],
      duration: "monthly",
      active: true,
    },
  ]);

  const stats = [
    {
      title: "Total Plans",
      value: plans.length,
      icon: <Icons.Layers className="h-4 w-4" />,
      trend: "up",
      trendValue: "12%",
    },
    {
      title: "Active Members",
      value: 234,
      icon: <Icons.Users className="h-4 w-4" />,
      trend: "up",
      trendValue: "8%",
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      icon: <Icons.DollarSign className="h-4 w-4" />,
      trend: "up",
      trendValue: "23%",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Membership Plans
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and monitor your practice's membership plans
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Plans Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Current Plans</h2>
          <Button
            onClick={() => {
              // Handle adding new plan
              notifyDispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                  id: Date.now().toString(),
                  type: "info",
                  title: "New Plan",
                  message: "Creating new membership plan...",
                  timestamp: new Date().toISOString(),
                  read: false,
                  priority: "medium",
                },
              });
            }}
          >
            <Icons.Plus className="h-4 w-4 mr-2" />
            Add New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-6 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm">
                    <Icons.Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  /{plan.duration}
                </span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Icons.Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {plan.active ? "Active" : "Inactive"}
                  </span>
                  <Button variant="outline" size="sm">
                    {plan.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
