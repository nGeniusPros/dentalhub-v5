import type { Notification } from '../types/notification';

export class NotificationService {
  private notifications: Notification[] = [];
  private unreadCount: number = 0;

  addNotification(notification: Notification) {
    this.notifications = [notification, ...this.notifications];
    this.unreadCount++;
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map(notification =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    );
    this.unreadCount = Math.max(0, this.unreadCount - 1);
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }

  updateNotification(id: string, updates: Partial<Notification>) {
    this.notifications = this.notifications.map(notification =>
      notification.id === id
        ? { ...notification, ...updates }
        : notification
    );
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(notification => ({ ...notification, read: true }));
    this.unreadCount = 0;
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }

  removeNotification(id: string) {
    this.unreadCount = this.notifications.find(n => n.id === id && !n.read)
      ? this.unreadCount - 1
      : this.unreadCount;
    this.notifications = this.notifications.filter(notification => notification.id !== id);
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }

  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }

  getNotifications() {
    return { notifications: this.notifications, unreadCount: this.unreadCount };
  }
}