import React, { createContext, useContext, useReducer } from 'react';
import type { 
  Course, 
  Badge, 
  Challenge, 
  Certification, 
  Assignment, 
  LearningPath, 
  GameElement 
} from '../types/learning';

interface LearningState {
  courses: Course[];
  badges: Badge[];
  challenges: Challenge[];
  certifications: Certification[];
  assignments: Assignment[];
  learningPaths: LearningPath[];
  gameElements: GameElement[];
  points: number;
  level: number;
  loading: boolean;
  error: string | null;
}

type LearningAction =
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: { courseId: string; progress: number } }
  | { type: 'COMPLETE_COURSE'; payload: string }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: LearningState = {
  courses: [],
  badges: [],
  challenges: [],
  certifications: [],
  assignments: [],
  learningPaths: [],
  gameElements: [],
  points: 0,
  level: 1,
  loading: false,
  error: null
};

const learningReducer = (state: LearningState, action: LearningAction): LearningState => {
  switch (action.type) {
    case 'SET_COURSES':
      return { ...state, courses: action.payload };
    case 'UPDATE_COURSE_PROGRESS':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.courseId
            ? { ...course, progress: action.payload.progress }
            : course
        )
      };
    case 'COMPLETE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload
            ? { ...course, progress: 100, status: 'completed' }
            : course
        )
      };
    case 'UNLOCK_BADGE':
      return {
        ...state,
        badges: state.badges.map(badge =>
          badge.id === action.payload
            ? { ...badge, unlocked: true, unlockedAt: new Date().toISOString() }
            : badge
        )
      };
    case 'ADD_POINTS':
      return {
        ...state,
        points: state.points + action.payload
      };
    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const LearningContext = createContext<{
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
} | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  return (
    <LearningContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};