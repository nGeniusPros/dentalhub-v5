import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";

export const SMSCampaignList = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      name: "Appointment Reminders",
      status: "active",
      audience: "All Patients",
      sent: 1234,
      delivered: 1200,
      opened: 980,
      lastSent: "2024-03-01",
    },
    {
      id: "2",
      name: "Treatment Follow-ups",
      status: "scheduled",
      audience: "Recent Patients",
      sent: 456,
      delivered: 450,
      opened: 380,
      lastSent: "2024-02-28",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter campaigns based on search query
  };

  const handleFilter = () => {
    setShowFilterDialog(true);
  };

  const handleEdit = (campaignId: string) => {
    console.log("Editing campaign:", campaignId);
  };

  const handleDuplicate = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      const newCampaign = {
        ...campaign,
        id: Date.now().toString(),
        name: `${campaign.name} (Copy)`,
        status: "scheduled" as const,
      };
      setCampaigns([...campaigns, newCampaign]);
    }
  };

  const handleDelete = (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(campaigns.filter((c) => c.id !== campaignId));
    }
  };

  const handleToggleStatus = (campaignId: string) => {
    setCampaigns(
      campaigns.map((campaign) => {
        if (campaign.id === campaignId) {
          return {
            ...campaign,
            status: campaign.status === "active" ? "scheduled" : "active",
          };
        }
        return campaign;
      }),
    );
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
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <Button variant="outline" onClick={handleFilter}>
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
                Audience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Sent
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      campaign.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {campaign.audience}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    Sent: {campaign.sent} | Delivered: {campaign.delivered}
                  </div>
                  <div className="text-sm text-gray-500">
                    Open Rate:{" "}
                    {((campaign.opened / campaign.delivered) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {campaign.lastSent}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowActionsMenu(
                          showActionsMenu === campaign.id ? null : campaign.id,
                        )
                      }
                    >
                      <Icons.MoreHorizontal className="w-4 h-4" />
                    </Button>

                    {showActionsMenu === campaign.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => handleEdit(campaign.id)}
                        >
                          <Icons.Edit2 className="w-4 h-4 inline-block mr-2" />
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => handleDuplicate(campaign.id)}
                        >
                          <Icons.Copy className="w-4 h-4 inline-block mr-2" />
                          Duplicate
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => handleToggleStatus(campaign.id)}
                        >
                          {campaign.status === "active" ? (
                            <>
                              <Icons.Pause className="w-4 h-4 inline-block mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Icons.Play className="w-4 h-4 inline-block mr-2" />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Icons.Trash2 className="w-4 h-4 inline-block mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
