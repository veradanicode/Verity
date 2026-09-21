import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Notification, NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  activeFilter: 'all' | 'unread' | 'read' = 'all';

  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  get notificationCount(): number {
    return this.notificationService.notificationCount;
  }

  get unreadCount(): number {
    return this.notificationService.unreadCount;
  }

  get filteredNotifications(): Notification[] {
    let notifications = this.notificationService.getNotificationsSnapshot();

    if (this.activeFilter === 'unread') {
      notifications = notifications.filter((notification) => !notification.read);
    }

    if (this.activeFilter === 'read') {
      notifications = notifications.filter((notification) => notification.read);
    }

    return notifications;
  }

  setFilter(filter: 'all' | 'unread' | 'read'): void {
    this.activeFilter = filter;
  }

  markAsRead(notification: Notification): void {
    if (notification.read) {
      return;
    }

    this.notificationService.markAsRead(notification.id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id);
  }

  openNotification(notification: Notification): void {
    this.markAsRead(notification);

    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  getTypeClass(type: Notification['type']): string {
    return `notification-${type}`;
  }
}
