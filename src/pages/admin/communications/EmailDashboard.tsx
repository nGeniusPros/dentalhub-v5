import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useEmail } from '../../../contexts/EmailContext';
import { EmailEditor } from '../../../components/email/EmailEditor';
import { TemplateGallery } from '../../../components/email/TemplateGallery';
import { ProviderSetup } from '../../../components/email/ProviderSetup';
import { EmailProviderDropdown } from '../../../components/email/EmailProviderDropdown';
import { RecipientSelector } from '../../../components/email/RecipientSelector';
import { CampaignAnalytics } from '../../../components/email/CampaignAnalytics';
import { EmailAnalytics } from './components/email/EmailAnalytics';
import { AIEmailInsights } from './components/email/AIEmailInsights';
import { EmailCampaignStats } from './components/email/EmailCampaignStats';
import type { EmailTemplate, EmailCampaign, EmailProvider } from '../../../types/email';

const EmailDashboard = () => {
  const { state, dispatch } = useEmail();
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleProviderConnect = async (provider: EmailProvider, apiKey: string) => {
    dispatch({ type: 'SET_SELECTED_PROVIDER', payload: { ...provider, apiKey, connected: true } });
  };

  const handleExport = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      console.warn('No data available to export');
      return;
    }

    if (!data || data.length === 0) {
      console.warn('No data available to export');
      return;
    }

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    // Apply filters to data
  };

  const handleDateRangeChange = (range: { start: Date | null; end: Date | null }) => {
    setDateRange(range);
    // Filter data by date range
  };

  const handleCreateCampaign = () => {
    setView('create');
    setStep(1);
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEmailContent(template.content);
    setStep(2);
  };

  const handleRecipientSelect = (criteria: any) => {
    setStep(3);
  };

  const handleSaveCampaign = () => {
    setView('list');
  };

  const handleScheduleCampaign = () => {
    setView('list');
  };

  const handleViewAnalytics = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setShowAnalytics(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Email Campaigns
          </h1>
          <p className="text-gray-600">Create and manage email campaigns with AI-powered insights</p>
        </div>
        {view === 'list' && (
          <Button onClick={handleCreateCampaign} className="bg-gradient-to-r from-navy to-purple text-white">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </div>

      {/* Main Content */}
      {view === 'list' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <EmailProviderDropdown
              providers={state.providers}
              selectedProvider={state.selectedProvider}
              onConnect={handleProviderConnect}
            />
          </div>

          {/* Campaign Stats */}
          <EmailCampaignStats />

          {/* Analytics Dashboard */}
          <EmailAnalytics />

          {/* AI Insights */}
          <AIEmailInsights />

          {/* Campaign List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Campaigns</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleFilter({})}
                  className="flex items-center gap-2"
                >
                  <Icons.Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (state.campaigns && state.campaigns.length > 0) {
                      handleExport(state.campaigns, 'email-campaigns');
                    } else {
                      alert('No campaign data available to export');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Icons.Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Campaign Table */}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Click Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {state.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icons.Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.subject}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        campaign.status === 'sent' 
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : campaign.status === 'draft'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {campaign.stats?.sent || 0} sent
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.stats?.delivered || 0} delivered
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {((campaign.stats?.opened || 0) / (campaign.stats?.delivered || 1) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {((campaign.stats?.clicked || 0) / (campaign.stats?.delivered || 1) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewAnalytics(campaign)}
                        >
                          <Icons.BarChart2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const newCampaign = { ...campaign };
                            delete newCampaign.id;
                            dispatch({ 
                              type: 'SET_CAMPAIGNS', 
                              payload: [...state.campaigns, { ...newCampaign, id: Date.now().toString() }]
                            });
                          }}
                        >
                          <Icons.Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const menu = [
                              { label: 'Edit', icon: Icons.Edit2, action: () => setSelectedCampaign(campaign) },
                              { label: 'Duplicate', icon: Icons.Copy, action: () => {/* Duplicate logic */} },
                              { label: 'Delete', icon: Icons.Trash2, action: () => {/* Delete logic */} }
                            ];
                            // Show menu
                          }}
                        >
                          <Icons.MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Views */}
      {view !== 'list' && (
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex gap-4 mb-8">
            {[
              { step: 1, label: 'Choose Template' },
              { step: 2, label: 'Design Email' },
              { step: 3, label: 'Select Recipients' },
              { step: 4, label: 'Review & Schedule' }
            ].map(({ step: s, label }) => (
              <div
                key={s}
                className={`flex items-center gap-2 ${
                  s === step ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s === step ? 'bg-primary text-white' : 'bg-gray-100'
                }`}>
                  {s}
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <TemplateGallery
              templates={state.templates}
              onSelect={handleTemplateSelect}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter subject line..."
                  />
                </div>

                <EmailEditor
                  content={emailContent}
                  onChange={setEmailContent}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Select Recipients
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <RecipientSelector onSelect={handleRecipientSelect} />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Next: Review & Schedule
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Review & Schedule</h2>

                <div className="space-y-6">
                  {/* Campaign Preview */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="mb-2">
                        <span className="text-sm font-medium">Subject:</span>
                        <span className="ml-2 text-sm">{subject}</span>
                      </div>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: emailContent }} />
                    </div>
                  </div>

                  {/* Schedule Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Send Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Send Time</label>
                        <input
                          type="time"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button variant="outline" onClick={handleSaveCampaign}>
                  Save as Draft
                </Button>
                <Button onClick={handleScheduleCampaign}>
                  Schedule Campaign
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedCampaign.name}</h2>
                <Button variant="ghost" onClick={() => {
                  setShowAnalytics(false);
                  setSelectedCampaign(null);
                }}>
                  <Icons.X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <CampaignAnalytics campaign={selectedCampaign} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmailDashboard;