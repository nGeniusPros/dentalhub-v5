import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LearningService } from '../services/learning';
import { toast } from '../components/ui/toast';

export const useLearning = () => {
  const queryClient = useQueryClient();
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    status: 'all',
    level: 'all'
  });

  // Courses
  const useCoursesQuery = () => useQuery(['courses', activeFilters], () => LearningService.getCourses());
  const useStartCourseMutation = () => useMutation(
    (courseId: string) => LearningService.startCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['courses']);
        toast.success('Course started successfully');
      }
    }
  );

  // Badges
  const useBadgesQuery = () => useQuery(['badges'], () => LearningService.getBadges());
  const useClaimBadgeMutation = () => useMutation(
    (badgeId: string) => LearningService.claimBadge(badgeId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['badges']);
        toast.success('Badge claimed successfully');
      }
    }
  );

  // Challenges
  const useChallengesQuery = () => useQuery(['challenges'], () => LearningService.getChallenges());
  const useJoinChallengeMutation = () => useMutation(
    (challengeId: string) => LearningService.joinChallenge(challengeId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['challenges']);
        toast.success('Joined challenge successfully');
      }
    }
  );

  // Certifications
  const useCertificationsQuery = () => useQuery(['certifications'], () => LearningService.getCertifications());
  const useStartCertificationMutation = () => useMutation(
    (certId: string) => LearningService.startCertification(certId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['certifications']);
        toast.success('Certification started successfully');
      }
    }
  );

  // Assignments
  const useAssignmentsQuery = () => useQuery(['assignments'], () => LearningService.getAssignments());
  const useSubmitAssignmentMutation = () => useMutation(
    ({ id, data }: { id: string; data: any }) => LearningService.submitAssignment(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignments']);
        toast.success('Assignment submitted successfully');
      }
    }
  );

  // Learning Path
  const useLearningPathQuery = () => useQuery(['learningPath'], () => LearningService.getLearningPath());
  const useCustomizeLearningPathMutation = () => useMutation(
    (preferences: any) => LearningService.customizeLearningPath(preferences),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['learningPath']);
        toast.success('Learning path customized successfully');
      }
    }
  );

  // Rewards
  const useRewardsQuery = () => useQuery(['rewards'], () => LearningService.getRewards());
  const useClaimRewardMutation = () => useMutation(
    (rewardId: string) => LearningService.claimReward(rewardId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['rewards']);
        toast.success('Reward claimed successfully');
      }
    }
  );

  // Stats & Leaderboard
  const useLearningStatsQuery = () => useQuery(['learningStats'], () => LearningService.getLearningStats());
  const useLeaderboardQuery = () => useQuery(['leaderboard'], () => LearningService.getLeaderboard());

  // Additional Features
  const useExportCertificateMutation = () => useMutation(
    (certId: string) => LearningService.exportCertificate(certId),
    {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Certificate exported successfully');
      }
    }
  );

  const useShareBadgeMutation = () => useMutation(
    ({ badgeId, platform }: { badgeId: string; platform: string }) =>
      LearningService.shareBadge(badgeId, platform),
    {
      onSuccess: () => {
        toast.success('Badge shared successfully');
      }
    }
  );

  const useSyncProgressMutation = () => useMutation(
    () => LearningService.syncLearningProgress(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['courses']);
        queryClient.invalidateQueries(['badges']);
        queryClient.invalidateQueries(['challenges']);
        queryClient.invalidateQueries(['certifications']);
        toast.success('Learning progress synced successfully');
      }
    }
  );

  // Filters
  const updateFilters = useCallback((newFilters: Partial<typeof activeFilters>) => {
    setActiveFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    // Queries
    useCoursesQuery,
    useBadgesQuery,
    useChallengesQuery,
    useCertificationsQuery,
    useAssignmentsQuery,
    useLearningPathQuery,
    useRewardsQuery,
    useLearningStatsQuery,
    useLeaderboardQuery,

    // Mutations
    useStartCourseMutation,
    useClaimBadgeMutation,
    useJoinChallengeMutation,
    useStartCertificationMutation,
    useSubmitAssignmentMutation,
    useCustomizeLearningPathMutation,
    useClaimRewardMutation,
    useExportCertificateMutation,
    useShareBadgeMutation,
    useSyncProgressMutation,

    // Filters
    activeFilters,
    updateFilters
  };
};
