import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: any) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState({
    name: "",
    type: "upgrade",
    targetAudience: "all",
    startDate: "",
    endDate: "",
    incentive: {
      type: "points",
      value: 0,
    },
    message: "",
    channels: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(campaign);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
              Create Membership Campaign
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mt-6">
            {[
              { num: 1, label: "Campaign Details" },
              { num: 2, label: "Target Audience" },
              { num: 3, label: "Incentives" },
            ].map(({ num, label }) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {num}
                </div>
                <span
                  className={`ml-2 ${
                    step >= num ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {num < 3 && <div className="w-12 h-0.5 mx-2 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) =>
                    setCampaign((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type
                </label>
                <select
                  value={campaign.type}
                  onChange={(e) =>
                    setCampaign((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="upgrade">Membership Upgrade</option>
                  <option value="renewal">Renewal</option>
                  <option value="reactivation">Reactivation</option>
                  <option value="referral">Referral Program</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={campaign.startDate}
                    onChange={(e) =>
                      setCampaign((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={campaign.endDate}
                    onChange={(e) =>
                      setCampaign((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={campaign.targetAudience}
                  onChange={(e) =>
                    setCampaign((prev) => ({
                      ...prev,
                      targetAudience: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="all">All Members</option>
                  <option value="basic">Basic Plan Members</option>
                  <option value="premium">Premium Plan Members</option>
                  <option value="expired">Expired Members</option>
                  <option value="custom">Custom Segment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Communication Channels
                </label>
                <div className="space-y-2">
                  {["email", "sms", "push", "in_app"].map((channel) => (
                    <label key={channel} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campaign.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaign((prev) => ({
                              ...prev,
                              channels: [...prev.channels, channel],
                            }));
                          } else {
                            setCampaign((prev) => ({
                              ...prev,
                              channels: prev.channels.filter(
                                (c) => c !== channel,
                              ),
                            }));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">
                        {channel.replace("_", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incentive Type
                </label>
                <select
                  value={campaign.incentive.type}
                  onChange={(e) =>
                    setCampaign((prev) => ({
                      ...prev,
                      incentive: { ...prev.incentive, type: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="points">Bonus Points</option>
                  <option value="discount">Membership Discount</option>
                  <option value="gift">Free Gift</option>
                  <option value="service">Free Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incentive Value
                </label>
                <input
                  type="number"
                  value={campaign.incentive.value}
                  onChange={(e) =>
                    setCampaign((prev) => ({
                      ...prev,
                      incentive: {
                        ...prev.incentive,
                        value: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Message
                </label>
                <textarea
                  value={campaign.message}
                  onChange={(e) =>
                    setCampaign((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32"
                  placeholder="Enter campaign message..."
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit">Launch Campaign</Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
