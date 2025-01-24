import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate?: number;
  clickRate?: number;
  scheduledDate?: string;
  sentDate?: string;
}

export const EmailCampaigns: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Monthly Newsletter',
      subject: 'Your Dental Health Update - January 2025',
      status: 'sent',
      recipients: 2500,
      openRate: 45.2,
      clickRate: 12.8,
      sentDate: '2025-01-15'
    },
    {
      id: '2',
      name: 'Appointment Reminder',
      subject: 'Your Upcoming Dental Appointment',
      status: 'scheduled',
      recipients: 150,
      scheduledDate: '2025-01-25'
    },
    {
      id: '3',
      name: 'Special Offer',
      subject: 'Save 20% on Teeth Whitening',
      status: 'draft',
      recipients: 0
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => 
    (activeTab === 'all' || campaign.status === activeTab) &&
    (campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     campaign.subject.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Campaigns</h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage email campaigns</p>
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
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Icons.Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
            <Icons.Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.8%</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Click Rate</CardTitle>
            <Icons.MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
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
                <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.subject}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
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
              {campaign.openRate && (
                <div className="flex items-center">
                  <Icons.Eye className="h-4 w-4 mr-1" />
                  {campaign.openRate}% open rate
                </div>
              )}
              {campaign.clickRate && (
                <div className="flex items-center">
                  <Icons.MousePointerClick className="h-4 w-4 mr-1" />
                  {campaign.clickRate}% click rate
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