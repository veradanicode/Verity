import { Injectable } from '@angular/core';

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'project' | 'task' | 'meeting';
  time?: string;
  projectId?: number;
  projectName?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private events: CalendarEvent[] = [
    {
      id: 1,
      title: 'Client Portal Deadline',
      date: '2026-09-09',
      type: 'project',
      projectId: 3,
      projectName: 'Client Portal',
      description: 'Final project deadline.',
    },
    {
      id: 2,
      title: 'Sprint Planning',
      date: '2026-09-10',
      type: 'meeting',
      time: '10:00 AM',
      description: 'Team sprint planning session.',
    },
    {
      id: 3,
      title: 'Riverside Rebrand Review',
      date: '2026-09-12',
      type: 'project',
      projectId: 1,
      projectName: 'Riverside Rebrand',
      description: 'Review branding deliverables.',
    },
    {
      id: 4,
      title: 'Mobile App v2',
      date: '2026-09-15',
      type: 'task',
      projectId: 2,
      projectName: 'Mobile App v2',
      description: 'Review outstanding mobile app tasks.',
    },
    {
      id: 5,
      title: 'Mobile App v2 Deadline',
      date: '2026-09-19',
      type: 'project',
      projectId: 2,
      projectName: 'Mobile App v2',
      description: 'Project deadline.',
    },
    {
      id: 6,
      title: 'Q3 Finance Review',
      date: '2026-09-25',
      type: 'meeting',
      time: '2:00 PM',
      description: 'Quarterly finance review.',
    },
    {
      id: 7,
      title: 'Q3 Finance Review Deadline',
      date: '2026-09-30',
      type: 'project',
      projectId: 4,
      projectName: 'Q3 Finance Review',
      description: 'Project deadline.',
    },
  ];

  getEvents(): CalendarEvent[] {
    return this.events;
  }

  getEventsForDate(date: string): CalendarEvent[] {
    return this.events.filter((event) => event.date === date);
  }
}
