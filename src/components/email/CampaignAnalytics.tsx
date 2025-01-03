import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';
import type { EmailCampaign } from '../../types/email';

interface CampaignAnalyticsProps {
  campaign: EmailCampaign;
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaign }) => {
  const data = [
    { time: '1h', opens: 45, clicks: 12 },
    { time: '2h', opens: 89, clicks: 34 },
    { time: '4h', opens: 156, clicks: 67 },
    { time: '8h', opens: 234, clicks: 89 },
    { time: '12h', opens: 298, clicks: 123 },
    { time: '24h', opens: 345, clicks: 156 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.Mail className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-gray-500">Sent</h3>
          </div>
          <p className="text-2xl font-semibold">{campaign.stats?.sent || 0}</p>
          <p className="text-sm text-gray-500">Total recipients</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.Eye className="w-5 h-5 text-green-500" />
            <h3 className="text-sm font-medium text-gray-500">Opens</h3>
          </div>
          <p className="text-2xl font-semibold">
            {((campaign.stats?.opened || 0) / (campaign.stats?.delivered || 1) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">Open rate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.MousePointer className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
          </div>
          <p className="text-2xl font-semibold">
            {((campaign.stats?.clicked || 0) / (campaign.stats?.delivered || 1) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">Click rate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Icons.XCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-medium text-gray-500">Bounces</h3>
          </div>
          <p className="text-2xl font-semibold">
            {((campaign.stats?.bounced || 0) / (campaign.stats?.sent || 1) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">Bounce rate</p>
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-gray-900">Engagement Over Time</h3>
          <Button variant="outline" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1B2B5B', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1B2B5B', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="opens"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Link Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Link Performance</h3>
        <div className="space-y-4">
          {[
            { url: 'https://example.com/special-offer', clicks: 89, uniqueClicks: 76 },
            { url: 'https://example.com/book-appointment', clicks: 67, uniqueClicks: 54 },
            { url: 'https://example.com/services', clicks: 45, uniqueClicks: 38 }
          ].map((link, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{link.url}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {link.clicks} total clicks
                  </span>
                  <span className="text-sm text-gray-500">
                    {link.uniqueClicks} unique clicks
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Icons.ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};