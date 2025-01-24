import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SocialMediaStats } from './components/stats/SocialMediaStats';
import { EngagementMetrics } from './components/analytics/EngagementMetrics';
import { ContentCalendar } from './components/content/ContentCalendar';
import { PostPerformance } from './components/analytics/PostPerformance';
import { AudienceInsights } from './components/analytics/AudienceInsights';
import { PlatformBreakdown } from './components/analytics/PlatformBreakdown';
import { TopPosts } from './components/analytics/TopPosts';
import { HashtagPerformance } from './components/analytics/HashtagPerformance';
import { CompetitorAnalysis } from './components/analytics/CompetitorAnalysis';
import { socialMediaService } from "../../../services/socialMedia";

const SocialMediaDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5173/');
      return response.ok;
    } catch (err) {
      console.error('Server is not running:', err);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const serverRunning = await checkServerStatus();
      if (!serverRunning) {
        setError('Server is not reachable. Please check the server status.');
        setLoading(false);
        return;
      }
      try {
        const result = await socialMediaService.getData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text mb-1">
            Social Media Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive social media analytics and management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-navy to-purple text-white">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      <SocialMediaStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EngagementMetrics />
        <PlatformBreakdown />
        <AudienceInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPosts />
        <PostPerformance />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HashtagPerformance />
        <CompetitorAnalysis />
      </div>

      <ContentCalendar />
    </div>
  );
};

export default SocialMediaDashboard;