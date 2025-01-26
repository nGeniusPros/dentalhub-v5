import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "../components/ui/toast";
import { LearningService } from "../services/learning";
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
} from "../types/learning";

interface LearningState {
  courses: Course[];
  badges: Badge[];
  challenges: Challenge[];
  certifications: Certification[];
  assignments: Assignment[];
  learningPath: LearningPath | null;
  rewards: Reward[];
  stats: LearningStats | null;
  leaderboard: LeaderboardEntry[];
  points: number;
  level: number;
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
  preferences: {
    emailNotifications: boolean;
    reminderFrequency: "daily" | "weekly" | "monthly";
    showGameElements: boolean;
    autoSync: boolean;
  };
  loading: boolean;
  error: string | null;
}

type LearningAction =
  | { type: "SET_COURSES"; payload: Course[] }
  | { type: "UPDATE_COURSE_PROGRESS"; payload: { courseId: string; progress: number } }
  | { type: "COMPLETE_COURSE"; payload: string }
  | { type: "SET_BADGES"; payload: Badge[] }
  | { type: "UNLOCK_BADGE"; payload: string }
  | { type: "SET_CHALLENGES"; payload: Challenge[] }
  | { type: "UPDATE_CHALLENGE"; payload: Challenge }
  | { type: "SET_CERTIFICATIONS"; payload: Certification[] }
  | { type: "UPDATE_CERTIFICATION"; payload: Certification }
  | { type: "SET_ASSIGNMENTS"; payload: Assignment[] }
  | { type: "UPDATE_ASSIGNMENT"; payload: Assignment }
  | { type: "SET_LEARNING_PATH"; payload: LearningPath }
  | { type: "SET_REWARDS"; payload: Reward[] }
  | { type: "CLAIM_REWARD"; payload: string }
  | { type: "SET_STATS"; payload: LearningStats }
  | { type: "SET_LEADERBOARD"; payload: LeaderboardEntry[] }
  | { type: "ADD_POINTS"; payload: number }
  | { type: "LEVEL_UP" }
  | { type: "ADD_NOTIFICATION"; payload: { type: string; message: string } }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<LearningState["preferences"]> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: LearningState = {
  courses: [],
  badges: [],
  challenges: [],
  certifications: [],
  assignments: [],
  learningPath: null,
  rewards: [],
  stats: null,
  leaderboard: [],
  points: 0,
  level: 1,
  notifications: [],
  preferences: {
    emailNotifications: true,
    reminderFrequency: "weekly",
    showGameElements: true,
    autoSync: true,
  },
  loading: false,
  error: null,
};

const learningReducer = (
  state: LearningState,
  action: LearningAction,
): LearningState => {
  switch (action.type) {
    case "SET_COURSES":
      return { ...state, courses: action.payload };
    case "UPDATE_COURSE_PROGRESS":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId
            ? { ...course, progress: action.payload.progress }
            : course,
        ),
      };
    case "COMPLETE_COURSE":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload
            ? { ...course, progress: 100, status: "completed" }
            : course,
        ),
      };
    case "SET_BADGES":
      return { ...state, badges: action.payload };
    case "UNLOCK_BADGE":
      return {
        ...state,
        badges: state.badges.map((badge) =>
          badge.id === action.payload
            ? { ...badge, unlocked: true, unlockedAt: new Date().toISOString() }
            : badge,
        ),
      };
    case "SET_CHALLENGES":
      return { ...state, challenges: action.payload };
    case "UPDATE_CHALLENGE":
      return {
        ...state,
        challenges: state.challenges.map((challenge) =>
          challenge.id === action.payload.id ? action.payload : challenge,
        ),
      };
    case "SET_CERTIFICATIONS":
      return { ...state, certifications: action.payload };
    case "UPDATE_CERTIFICATION":
      return {
        ...state,
        certifications: state.certifications.map((cert) =>
          cert.id === action.payload.id ? action.payload : cert,
        ),
      };
    case "SET_ASSIGNMENTS":
      return { ...state, assignments: action.payload };
    case "UPDATE_ASSIGNMENT":
      return {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === action.payload.id ? action.payload : assignment,
        ),
      };
    case "SET_LEARNING_PATH":
      return { ...state, learningPath: action.payload };
    case "SET_REWARDS":
      return { ...state, rewards: action.payload };
    case "CLAIM_REWARD":
      return {
        ...state,
        rewards: state.rewards.filter((reward) => reward.id !== action.payload),
      };
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "SET_LEADERBOARD":
      return { ...state, leaderboard: action.payload };
    case "ADD_POINTS":
      return {
        ...state,
        points: state.points + action.payload,
        stats: state.stats
          ? {
              ...state.stats,
              pointsEarned: state.stats.pointsEarned + action.payload,
            }
          : null,
      };
    case "LEVEL_UP":
      return {
        ...state,
        level: state.level + 1,
      };
    case "ADD_NOTIFICATION":
      const notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: action.payload.type,
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        notifications: [notification, ...state.notifications],
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif,
        ),
      };
    case "UPDATE_PREFERENCES":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const LearningContext = createContext<
  | {
      state: LearningState;
      dispatch: React.Dispatch<LearningAction>;
      actions: {
        fetchInitialData: () => Promise<void>;
        syncProgress: () => Promise<void>;
        markNotificationRead: (id: string) => void;
        updatePreferences: (prefs: Partial<LearningState["preferences"]>) => void;
      };
    }
  | undefined
>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  const fetchInitialData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [
        courses,
        badges,
        challenges,
        certifications,
        assignments,
        learningPath,
        rewards,
        stats,
        leaderboard,
      ] = await Promise.all([
        LearningService.getCourses(),
        LearningService.getBadges(),
        LearningService.getChallenges(),
        LearningService.getCertifications(),
        LearningService.getAssignments(),
        LearningService.getLearningPath(),
        LearningService.getRewards(),
        LearningService.getLearningStats(),
        LearningService.getLeaderboard(),
      ]);

      dispatch({ type: "SET_COURSES", payload: courses });
      dispatch({ type: "SET_BADGES", payload: badges });
      dispatch({ type: "SET_CHALLENGES", payload: challenges });
      dispatch({ type: "SET_CERTIFICATIONS", payload: certifications });
      dispatch({ type: "SET_ASSIGNMENTS", payload: assignments });
      dispatch({ type: "SET_LEARNING_PATH", payload: learningPath });
      dispatch({ type: "SET_REWARDS", payload: rewards });
      dispatch({ type: "SET_STATS", payload: stats });
      dispatch({ type: "SET_LEADERBOARD", payload: leaderboard });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch learning data",
      });
      toast.error("Failed to fetch learning data");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const syncProgress = async () => {
    try {
      await LearningService.syncLearningProgress();
      await fetchInitialData();
      toast.success("Learning progress synced successfully");
    } catch (error) {
      toast.error("Failed to sync learning progress");
    }
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  };

  const updatePreferences = async (prefs: Partial<LearningState["preferences"]>) => {
    try {
      await LearningService.updateNotificationPreferences(prefs);
      dispatch({ type: "UPDATE_PREFERENCES", payload: prefs });
      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (state.preferences.autoSync) {
      const syncInterval = setInterval(syncProgress, 5 * 60 * 1000); // Sync every 5 minutes
      return () => clearInterval(syncInterval);
    }
  }, [state.preferences.autoSync]);

  const value = {
    state,
    dispatch,
    actions: {
      fetchInitialData,
      syncProgress,
      markNotificationRead,
      updatePreferences,
    },
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};
