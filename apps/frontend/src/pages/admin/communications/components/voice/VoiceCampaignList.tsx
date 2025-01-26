import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { ScheduleDialog } from "./ScheduleDialog";
import { EditCampaignDialog } from "./EditCampaignDialog";

export interface Campaign {
  id: string;
  name: string;
  type:
    | "recall"
    | "reactivation"
    | "treatment"
    | "appointment"
    | "event"
    | "custom";
  status: "active" | "scheduled" | "completed" | "paused";
  targetCount: number;
  completedCalls: number;
  successRate: number;
  scheduledDate?: string;
  lastRun?: string;
  schedule?: {
    startDate: string;
    startTime: string;
    maxAttempts: number;
    timeBetweenAttempts: number;
  };
}

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Recall Campaign - March",
    type: "recall",
    status: "active",
    targetCount: 150,
    completedCalls: 89,
    successRate: 45,
    lastRun: "2024-03-10",
  },
  {
    id: "2",
    name: "Treatment Follow-up",
    type: "treatment",
    status: "scheduled",
    targetCount: 75,
    completedCalls: 0,
    successRate: 0,
    scheduledDate: "2024-03-20",
  },
];

export const VoiceCampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  const handleStatusChange = (
    campaignId: string,
    status: Campaign["status"],
  ) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, status } : campaign,
      ),
    );
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleScheduleCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowScheduleDialog(true);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign.id !== campaignId),
      );
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <Button variant="outline">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Schedule
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icons.Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {campaign.type} Campaign
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full",
                      campaign.status === "active" &&
                        "bg-green-100 text-green-800",
                      campaign.status === "scheduled" &&
                        "bg-blue-100 text-blue-800",
                      campaign.status === "completed" &&
                        "bg-gray-100 text-gray-800",
                      campaign.status === "paused" &&
                        "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(campaign.completedCalls / campaign.targetCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {campaign.completedCalls}/{campaign.targetCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{campaign.successRate}%</span>
                    {campaign.successRate > 0 && (
                      <Icons.TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {campaign.scheduledDate ? (
                      <>
                        <Icons.Calendar className="w-4 h-4 inline-block mr-1 text-gray-400" />
                        {campaign.scheduledDate}
                      </>
                    ) : (
                      <>
                        <Icons.Clock className="w-4 h-4 inline-block mr-1 text-gray-400" />
                        Last run: {campaign.lastRun}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {campaign.status === "active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(campaign.id, "paused")
                        }
                        title="Pause Campaign"
                      >
                        <Icons.PauseCircle className="w-4 h-4" />
                      </Button>
                    ) : campaign.status === "paused" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(campaign.id, "active")
                        }
                        title="Resume Campaign"
                      >
                        <Icons.PlayCircle className="w-4 h-4" />
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCampaign(campaign)}
                      title="Edit Campaign"
                    >
                      <Icons.Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleScheduleCampaign(campaign)}
                      title="Schedule Campaign"
                    >
                      <Icons.Calendar className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      title="Delete Campaign"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Dialog */}
      <ScheduleDialog
        open={showScheduleDialog}
        campaign={selectedCampaign}
        onClose={() => {
          setShowScheduleDialog(false);
          setSelectedCampaign(null);
        }}
        onSchedule={(schedule) => {
          if (selectedCampaign) {
            setCampaigns((prev) =>
              prev.map((campaign) =>
                campaign.id === selectedCampaign.id
                  ? { ...campaign, schedule, status: "scheduled" }
                  : campaign,
              ),
            );
          }
          setShowScheduleDialog(false);
          setSelectedCampaign(null);
        }}
      />

      {/* Edit Campaign Dialog */}
      <EditCampaignDialog
        open={!!editingCampaign}
        campaign={editingCampaign}
        onClose={() => setEditingCampaign(null)}
        onSave={(updatedCampaign) => {
          setCampaigns((prev) =>
            prev.map((campaign) =>
              campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
            ),
          );
          setEditingCampaign(null);
        }}
      />
    </div>
  );
};
