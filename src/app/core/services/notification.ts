import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'task' | 'project' | 'deadline' | 'team';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: Notification[] = [
    {
      id: 1,
      title: 'New task assigned',
      message: 'You have been assigned a new task in Mobile App v2.',
      type: 'task',
      read: false,
      createdAt: '2026-09-21T09:00:00',
      link: '/tasks',
    },
    {
      id: 2,
      title: 'Project deadline approaching',
      message: 'Client Portal is due in 2 days.',
      type: 'deadline',
      read: false,
      createdAt: '2026-09-21T08:30:00',
      link: '/projects/3',
    },
    {
      id: 3,
      title: 'Project updated',
      message: 'Riverside Rebrand progress was updated to 72%.',
      type: 'project',
      read: true,
      createdAt: '2026-09-20T15:00:00',
      link: '/projects/1',
    },
    {
      id: 4,
      title: 'Team activity',
      message: 'Lara Mensah completed a task.',
      type: 'team',
      read: true,
      createdAt: '2026-09-20T12:00:00',
      link: '/tasks',
    },
    {
      id: 5,
      title: 'Task deadline',
      message: 'Mobile App v2 review is due soon.',
      type: 'deadline',
      read: false,
      createdAt: '2026-09-19T10:00:00',
      link: '/tasks',
    },
  ];

  private notificationsSubject = new BehaviorSubject<Notification[]>(this.notifications);

  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find((notification) => notification.id === id);

    if (!notification) {
      return;
    }

    notification.read = true;

    this.notifyChanges();
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => (notification.read = true));

    this.notifyChanges();
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter((notification) => notification.id !== id);

    this.notifyChanges();
  }

  private notifyChanges(): void {
    this.notificationsSubject.next(this.notifications);
  }
}
