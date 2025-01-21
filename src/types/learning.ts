export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  points: number;
  progress: number;
  modules: Module[];
  required: boolean;
  tags?: string[];
  thumbnail?: string;
  instructor?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'quiz' | 'reading' | 'interactive';
  duration: string;
  completed: boolean;
  order: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  progress?: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirements?: string[];
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
    completed?: boolean;
  }>;
  requirements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  description: string;
  earnedDate: string;
  expirationDate: string;
  status: 'active' | 'expiring' | 'expired';
  skills: string[];
  credentialId: string;
  thumbnail?: string;
  validationUrl?: string;
  requirements?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  type: 'quiz' | 'assessment' | 'project';
  points: number;
  timeEstimate: string;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  rewards: Array<{
    type: 'points' | 'badge' | 'certificate';
    value: number | string;
    unlockedAt?: string;
  }>;
}

export interface GameElement {
  id: string;
  type: 'points' | 'badge' | 'level' | 'achievement';
  name: string;
  description: string;
  value: number | string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}