import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { SettingsToggle } from "./SettingsToggle";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected";
  icon: keyof typeof Icons;
}

export const IntegrationsSettings = () => {
  const [integrations] = React.useState<Integration[]>([
    {
      id: "1",
      name: "Google Calendar",
      description: "Sync appointments with Google Calendar",
      status: "connected",
      icon: "Calendar",
    },
    {
      id: "2",
      name: "QuickBooks",
      description: "Financial management and accounting",
      status: "disconnected",
      icon: "DollarSign",
    },
    {
      id: "3",
      name: "Mailchimp",
      description: "Email marketing automation",
      status: "connected",
      icon: "Mail",
    },
    {
      id: "4",
      name: "Twilio",
      description: "SMS notifications and voice calls",
      status: "connected",
      icon: "MessageSquare",
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Integrations</h2>

      <div className="space-y-4">
        <SettingsToggle
          section="integrations"
          setting="autoSync"
          title="Automatic Sync"
          description="Automatically sync data between integrations"
        />

        <SettingsToggle
          section="integrations"
          setting="errorNotifications"
          title="Error Notifications"
          description="Receive notifications for integration errors"
        />

        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {React.createElement(Icons[integration.icon], {
                  className: "w-6 h-6 text-primary",
                })}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {integration.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  integration.status === "connected"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {integration.status === "connected"
                  ? "Connected"
                  : "Disconnected"}
              </span>
              <Button variant="outline" size="sm">
                {integration.status === "connected" ? "Configure" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button className="w-full">
          <Icons.Plus className="w-4 h-4 mr-2" />
          Add New Integration
        </Button>
      </div>
    </motion.div>
  );
};
