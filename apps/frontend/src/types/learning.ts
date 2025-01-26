export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  points: number;
  progress: number;
  modules: Module[];
  required: boolean;
  tags?: string[];
  thumbnail?: string;
  instructor?: string;
  status: "not_started" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  type: "video" | "quiz" | "reading" | "interactive";
  duration: string;
  completed: boolean;
  order: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: "Achievement" | "Skill" | "Completion" | "Excellence";
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlocked: boolean;
  progress?: number;
  criteria?: Array<{
    description: string;
    completed: boolean;
  }>;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  endDate: string;
  participants: number;
  tasks?: Array<{
    id: string;
    title: string;
    points: number;
    completed: boolean;
  }>;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  validUntil?: string;
  estimatedTime: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  progress?: number;
  requirements?: Array<{
    description: string;
    completed: boolean;
  }>;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "overdue";
  dueDate: string;
  points?: number;
  estimatedTime?: string;
  courseId?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  stages: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    current: boolean;
    courses: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  }>;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  userPoints: number;
  category?: "Premium" | "Professional" | "Achievement";
  expiryDate?: string;
}

export interface LearningStats {
  coursesCompleted: number;
  badgesEarned: number;
  learningHours: string;
  pointsEarned: number;
  trends: {
    coursesCompletedTrend: number;
    badgesEarnedTrend: number;
    learningHoursTrend: number;
    pointsEarnedTrend: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  role: string;
  points: number;
  avatar?: string;
  rank: number;
  trend: number;
}
