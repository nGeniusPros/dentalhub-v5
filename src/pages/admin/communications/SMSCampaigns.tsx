import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SMSCampaignStats } from './components/sms/SMSCampaignStats';
import { SMSAnalytics } from './components/sms/SMSAnalytics';
import { AISMSInsights } from './components/sms/AISMSInsights';
import { SMSCampaignList } from './components/sms/SMSCampaignList';
import { CreateCampaignDialog } from './components/sms/CreateCampaignDialog';

const SMSCampaigns = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            NGenius Dental Hub
          </h1>
          <p className="text-gray-600">Powered by: Ngenius Pros</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-navy to-purple text-white"
        >
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <SMSCampaignStats />

      {/* Analytics Dashboard */}
      <SMSAnalytics />

      {/* AI Insights */}
      <AISMSInsights />

      {/* Campaign List */}
      <SMSCampaignList />

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};

export default SMSCampaigns;