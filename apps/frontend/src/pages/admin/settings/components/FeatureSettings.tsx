import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { Toggle } from "../../../../components/ui/toggle";
import { useSettings } from "../../../../contexts/SettingsContext";
import type { Settings } from "../../../../types/settings";

interface FeatureGroup {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  features: Feature[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  roles: ("admin" | "staff" | "patient")[];
  defaultEnabled: boolean;
}

const featureGroups: FeatureGroup[] = [
  {
    title: "Clinical",
    description: "Patient care and treatment features",
    icon: "Stethoscope",
    features: [
      {
        id: "patient_records",
        name: "Patient Records",
        description: "Access and manage patient medical records",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "treatment_plans",
        name: "Treatment Plans",
        description: "Create and manage treatment plans",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "appointments",
        name: "Appointments",
        description: "Schedule and manage appointments",
        roles: ["admin", "staff", "patient"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "Analytics",
    description: "Data analysis and reporting",
    icon: "BarChart2",
    features: [
      {
        id: "practice_analytics",
        name: "Practice Analytics",
        description: "View practice performance metrics",
        roles: ["admin"],
        defaultEnabled: true,
      },
      {
        id: "financial_reports",
        name: "Financial Reports",
        description: "Access financial reporting tools",
        roles: ["admin"],
        defaultEnabled: true,
      },
      {
        id: "staff_performance",
        name: "Staff Performance",
        description: "Track staff productivity and metrics",
        roles: ["admin"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "Insurance",
    description: "Insurance and claims management",
    icon: "Shield",
    features: [
      {
        id: "insurance_verification",
        name: "Insurance Verification",
        description: "Verify patient insurance coverage",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "claims_management",
        name: "Claims Management",
        description: "Process and track insurance claims",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "fee_schedules",
        name: "Fee Schedules",
        description: "Manage insurance fee schedules",
        roles: ["admin"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "Communications",
    description: "Patient communication tools",
    icon: "MessageSquare",
    features: [
      {
        id: "email_campaigns",
        name: "Email Campaigns",
        description: "Create and manage email campaigns",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "sms_notifications",
        name: "SMS Notifications",
        description: "Send SMS reminders and notifications",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "patient_portal",
        name: "Patient Portal",
        description: "Patient communication platform",
        roles: ["admin", "staff", "patient"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "HR & Staff",
    description: "Staff management and HR tools",
    icon: "Users",
    features: [
      {
        id: "staff_management",
        name: "Staff Management",
        description: "Manage staff profiles and access",
        roles: ["admin"],
        defaultEnabled: true,
      },
      {
        id: "scheduling",
        name: "Staff Scheduling",
        description: "Manage staff schedules and availability",
        roles: ["admin"],
        defaultEnabled: true,
      },
      {
        id: "performance_reviews",
        name: "Performance Reviews",
        description: "Conduct staff performance reviews",
        roles: ["admin"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "Learning & Development",
    description: "Training and educational resources",
    icon: "GraduationCap",
    features: [
      {
        id: "staff_training",
        name: "Staff Training",
        description: "Access training materials and courses",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "patient_education",
        name: "Patient Education",
        description: "Patient educational resources",
        roles: ["admin", "staff", "patient"],
        defaultEnabled: true,
      },
      {
        id: "compliance_training",
        name: "Compliance Training",
        description: "Required compliance training modules",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "Gamification",
    description: "Engagement and rewards features",
    icon: "Trophy",
    features: [
      {
        id: "staff_leaderboards",
        name: "Staff Leaderboards",
        description: "Staff performance rankings and rewards",
        roles: ["admin", "staff"],
        defaultEnabled: true,
      },
      {
        id: "patient_rewards",
        name: "Patient Rewards",
        description: "Patient loyalty and rewards program",
        roles: ["admin", "staff", "patient"],
        defaultEnabled: true,
      },
      {
        id: "achievements",
        name: "Achievements",
        description: "Staff and patient achievements system",
        roles: ["admin", "staff", "patient"],
        defaultEnabled: true,
      },
    ],
  },
  {
    title: "Membership",
    description: "Membership plans and benefits",
    icon: "Crown",
    features: [
      {
        id: "membership_plans",
        name: "Membership Plans",
        description: "Manage membership plan offerings",
        roles: ["admin"],
        defaultEnabled: true,
      },
      {
        id: "benefits_management",
        name: "Benefits Management",
        description: "Configure membership benefits",
        roles: ["admin"],
        defaultEnabled: true,
      },
      {
        id: "member_portal",
        name: "Member Portal",
        description: "Member-exclusive features and content",
        roles: ["admin", "staff", "patient"],
        defaultEnabled: true,
      },
    ],
  },
];

export const FeatureSettings = () => {
  const { state, updateSettings } = useSettings();
  const { settings } = state;

  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    await updateSettings({
      features: {
        ...settings.features,
        [featureId]: enabled,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Feature Management
          </h2>
          <p className="text-gray-500">
            Control access to features and functionality
          </p>
        </div>
        <Button variant="outline">
          <Icons.RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <div className="space-y-8">
        {featureGroups.map((group) => (
          <div
            key={group.title}
            className="border border-gray-200 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                {React.createElement(Icons[group.icon], {
                  className: "w-6 h-6 text-primary",
                })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {group.title}
                </h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {group.features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">
                        {feature.name}
                      </h4>
                      <div className="flex gap-2">
                        {feature.roles.map((role) => (
                          <span
                            key={role}
                            className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full",
                              role === "admin" &&
                                "bg-purple-100 text-purple-800",
                              role === "staff" && "bg-blue-100 text-blue-800",
                              role === "patient" &&
                                "bg-green-100 text-green-800",
                            )}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Toggle
                      checked={
                        settings.features?.[feature.id] ??
                        feature.defaultEnabled
                      }
                      onChange={(checked) =>
                        handleFeatureToggle(feature.id, checked)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
