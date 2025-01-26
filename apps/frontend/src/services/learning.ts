import { api } from '../lib/api';
import type {
  Course,
  Badge,
  Challenge,
  Certification,
  Assignment,
  LearningPath,
  Reward,
  LearningStats,
  LeaderboardEntry
} from '../types/learning';

export const LearningService = {
  // Courses
  getCourses: () => api.get<Course[]>('/learning/courses'),
  getCourseById: (id: string) => api.get<Course>(`/learning/courses/${id}`),
  startCourse: (id: string) => api.post(`/learning/courses/${id}/start`),
  updateCourseProgress: (id: string, progress: number) => 
    api.put(`/learning/courses/${id}/progress`, { progress }),

  // Badges
  getBadges: () => api.get<Badge[]>('/learning/badges'),
  getBadgeById: (id: string) => api.get<Badge>(`/learning/badges/${id}`),
  claimBadge: (id: string) => api.post(`/learning/badges/${id}/claim`),

  // Challenges
  getChallenges: () => api.get<Challenge[]>('/learning/challenges'),
  getChallengeById: (id: string) => api.get<Challenge>(`/learning/challenges/${id}`),
  joinChallenge: (id: string) => api.post(`/learning/challenges/${id}/join`),
  updateChallengeProgress: (id: string, taskId: string, completed: boolean) =>
    api.put(`/learning/challenges/${id}/tasks/${taskId}`, { completed }),

  // Certifications
  getCertifications: () => api.get<Certification[]>('/learning/certifications'),
  getCertificationById: (id: string) => api.get<Certification>(`/learning/certifications/${id}`),
  startCertification: (id: string) => api.post(`/learning/certifications/${id}/start`),
  updateCertificationProgress: (id: string, progress: number) =>
    api.put(`/learning/certifications/${id}/progress`, { progress }),

  // Assignments
  getAssignments: () => api.get<Assignment[]>('/learning/assignments'),
  getAssignmentById: (id: string) => api.get<Assignment>(`/learning/assignments/${id}`),
  submitAssignment: (id: string, data: any) => api.post(`/learning/assignments/${id}/submit`, data),

  // Learning Path
  getLearningPath: () => api.get<LearningPath>('/learning/path'),
  updateLearningPath: (data: Partial<LearningPath>) => api.put('/learning/path', data),
  customizeLearningPath: (preferences: any) => api.post('/learning/path/customize', preferences),

  // Rewards
  getRewards: () => api.get<Reward[]>('/learning/rewards'),
  claimReward: (id: string) => api.post(`/learning/rewards/${id}/claim`),

  // Stats & Leaderboard
  getLearningStats: () => api.get<LearningStats>('/learning/stats'),
  getLeaderboard: () => api.get<LeaderboardEntry[]>('/learning/leaderboard'),

  // Additional Features
  exportCertificate: (certificationId: string) => 
    api.get(`/learning/certifications/${certificationId}/export`, { responseType: 'blob' }),
  shareBadge: (badgeId: string, platform: string) =>
    api.post(`/learning/badges/${badgeId}/share`, { platform }),
  generateLearningReport: (filters: any) =>
    api.post('/learning/reports/generate', filters, { responseType: 'blob' }),
  syncLearningProgress: () => api.post('/learning/sync'),
  
  // Notifications & Reminders
  getLearningNotifications: () => api.get('/learning/notifications'),
  setLearningReminder: (data: { type: string; frequency: string; time?: string }) =>
    api.post('/learning/reminders', data),
  updateNotificationPreferences: (preferences: any) =>
    api.put('/learning/notifications/preferences', preferences)
};
