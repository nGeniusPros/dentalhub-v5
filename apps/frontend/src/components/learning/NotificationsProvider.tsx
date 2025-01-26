import React, { createContext, useContext, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { toast } from '../ui/toast';
import { useLearning } from '../../contexts/LearningContext';

interface NotificationsContextType {
  showNotification: (type: string, message: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useLearning();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Icons.Trophy className="w-5 h-5 text-yellow-500" />;
      case 'course':
        return <Icons.GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'challenge':
        return <Icons.Target className="w-5 h-5 text-purple-500" />;
      case 'reward':
        return <Icons.Gift className="w-5 h-5 text-green-500" />;
      default:
        return <Icons.Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const showNotification = (type: string, message: string) => {
    // Add to learning context state
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type, message }
    });

    // Show toast notification
    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      icon: getNotificationIcon(type)
    });

    // If email notifications are enabled, we would send them here
    if (state.preferences.emailNotifications) {
      // Implement email notification logic
      console.log('Email notification would be sent:', { type, message });
    }
  };

  // Listen for learning events that should trigger notifications
  useEffect(() => {
    const checkForAchievements = () => {
      state.badges.forEach(badge => {
        if (badge.unlocked && !badge.unlockedAt) {
          showNotification('achievement', `You've earned the "${badge.title}" badge!`);
        }
      });
    };

    const checkForCourseProgress = () => {
      state.courses.forEach(course => {
        if (course.progress === 100 && course.status !== 'completed') {
          showNotification('course', `Congratulations! You've completed "${course.title}"`);
        } else if (course.progress >= 50 && course.progress < 55) {
          showNotification('course', `You're halfway through "${course.title}"! Keep going!`);
        }
      });
    };

    const checkForChallenges = () => {
      state.challenges.forEach(challenge => {
        const endDate = new Date(challenge.endDate);
        const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft === 1) {
          showNotification('challenge', `"${challenge.title}" challenge ends tomorrow!`);
        }
      });
    };

    const checkForAssignments = () => {
      state.assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const daysLeft = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft === 1 && assignment.status === 'pending') {
          showNotification('assignment', `Assignment "${assignment.title}" is due tomorrow!`);
        }
      });
    };

    // Run checks
    checkForAchievements();
    checkForCourseProgress();
    checkForChallenges();
    checkForAssignments();

    // Set up periodic checks
    const checkInterval = setInterval(() => {
      checkForChallenges();
      checkForAssignments();
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(checkInterval);
  }, [state.badges, state.courses, state.challenges, state.assignments, state.preferences.emailNotifications]);

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
