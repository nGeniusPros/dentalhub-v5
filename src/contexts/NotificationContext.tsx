import React, { createContext, useContext, useReducer } from 'react';
import type { Notification, NotificationState } from '../types/notification';
import { NotificationService } from '../services/notificationService';

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
	| { type: 'CLEAR_ALL' };

const initialState: NotificationState = {
  notifications: [],
		unreadCount: 0
};

const notificationService = new NotificationService();

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const { notifications, unreadCount } = notificationService.addNotification(action.payload);
      return { notifications, unreadCount };
    }
    case 'MARK_AS_READ': {
      const { notifications, unreadCount } = notificationService.markAsRead(action.payload);
      return { notifications, unreadCount };
    }
    case 'UPDATE_NOTIFICATION': {
      const { notifications, unreadCount } = notificationService.updateNotification(action.payload.id, action.payload.updates);
      return { notifications, unreadCount };
    }
    case 'MARK_ALL_AS_READ': {
      const { notifications, unreadCount } = notificationService.markAllAsRead();
      return { notifications, unreadCount };
    }
    case 'REMOVE_NOTIFICATION': {
      const { notifications, unreadCount } = notificationService.removeNotification(action.payload);
      return { notifications, unreadCount };
    }
    case 'CLEAR_ALL': {
      const { notifications, unreadCount } = notificationService.clearAll();
      return { notifications, unreadCount };
    }
    default:
      return state;
  }
};

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
} | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

		return (
			<NotificationContext.Provider value={{ state, dispatch }}>
						{children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
	if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};