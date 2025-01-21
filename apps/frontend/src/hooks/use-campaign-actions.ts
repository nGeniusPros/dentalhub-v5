import { useState } from 'react';
import { Campaign } from './use-campaigns';

export const useCampaignActions = () => {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleScheduleCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setShowScheduleDialog(false);
    setSelectedCampaign(null);
  };

  const handleCloseEditDialog = () => {
    setEditingCampaign(null);
  };

  return {
    editingCampaign,
    showScheduleDialog,
    selectedCampaign,
    handleEditCampaign,
    handleScheduleCampaign,
    handleCloseScheduleDialog,
    handleCloseEditDialog,
    setEditingCampaign
  };
};