import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SMSCampaign {
  id: string;
  name: string;
  message: string;
  status: "draft" | "scheduled" | "sent";
  recipients: number;
  deliveryRate?: number;
  responseRate?: number;
  scheduledDate?: string;
  sentDate?: string;
}

export const SMSCampaigns: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const campaigns: SMSCampaign[] = [
    {
      id: "1",
      name: "Appointment Reminders",
      message:
        "Reminder: Your dental appointment is tomorrow at 2 PM. Reply Y to confirm or N to reschedule.",
      status: "sent",
      recipients: 150,
      deliveryRate: 98.5,
      responseRate: 85.2,
      sentDate: "2025-01-22",
    },
    {
      id: "2",
      name: "Follow-up Care",
      message:
        "How are you feeling after your recent procedure? Reply 1-5 to rate your experience.",
      status: "scheduled",
      recipients: 75,
      scheduledDate: "2025-01-24",
    },
    {
      id: "3",
      name: "Special Promotion",
      message:
        "Limited time offer: 20% off teeth whitening this month! Reply INFO for details.",
      status: "draft",
      recipients: 0,
    },
  ];

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      (activeTab === "all" || campaign.status === activeTab) &&
      (campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.message.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SMS Campaigns
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create and manage SMS campaigns
          </p>
        </div>
        <Button>
          <Icons.Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <Icons.MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,234</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Icons.CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Icons.Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.4% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {campaign.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {campaign.message}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {campaign.status.charAt(0).toUpperCase() +
                    campaign.status.slice(1)}
                </span>
                <Button variant="ghost" size="sm">
                  <Icons.MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Icons.Users className="h-4 w-4 mr-1" />
                {campaign.recipients} recipients
              </div>
              {campaign.deliveryRate && (
                <div className="flex items-center">
                  <Icons.CheckCircle className="h-4 w-4 mr-1" />
                  {campaign.deliveryRate}% delivered
                </div>
              )}
              {campaign.responseRate && (
                <div className="flex items-center">
                  <Icons.Reply className="h-4 w-4 mr-1" />
                  {campaign.responseRate}% response rate
                </div>
              )}
              {campaign.scheduledDate && (
                <div className="flex items-center">
                  <Icons.Calendar className="h-4 w-4 mr-1" />
                  Scheduled for {campaign.scheduledDate}
                </div>
              )}
              {campaign.sentDate && (
                <div className="flex items-center">
                  <Icons.Check className="h-4 w-4 mr-1" />
                  Sent on {campaign.sentDate}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
