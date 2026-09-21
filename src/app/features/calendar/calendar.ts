import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'project' | 'task' | 'meeting';
  time?: string;
  projectId?: number;
  projectName?: string;
  description?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  currentDate = new Date();

  calendarDays: (number | null)[] = [];

  selectedDate: string | null = null;

  events: CalendarEvent[] = [
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

  constructor() {
    this.generateCalendar();
  }

  get monthYearLabel(): string {
    return this.currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }

  get currentMonthName(): string {
    return this.currentDate.toLocaleString('default', {
      month: 'long',
    });
  }

  get upcomingEvents(): CalendarEvent[] {
    return this.events
      .filter((event) => new Date(event.date) >= new Date(this.todayDate))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }

  get todayDate(): string {
    const today = new Date();

    return this.formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  }

  get selectedDateEvents(): CalendarEvent[] {
    if (!this.selectedDate) {
      return [];
    }

    return this.events.filter((event) => event.date === this.selectedDate);
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.selectedDate = null;
    this.generateCalendar();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.selectedDate = null;
    this.generateCalendar();
  }

  goToToday(): void {
    const today = new Date();

    this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);

    this.selectedDate = this.todayDate;
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    this.calendarDays = days;
  }

  selectDate(day: number | null): void {
    if (!day) {
      return;
    }

    this.selectedDate = this.formatDate(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day,
    );
  }

  isToday(day: number | null): boolean {
    if (!day) {
      return false;
    }

    return (
      this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day) ===
      this.todayDate
    );
  }

  hasEvents(day: number | null): boolean {
    if (!day) {
      return false;
    }

    const date = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);

    return this.events.some((event) => event.date === date);
  }

  getEventsForDay(day: number | null): CalendarEvent[] {
    if (!day) {
      return [];
    }

    const date = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);

    return this.events.filter((event) => event.date === date);
  }

  isSelectedDate(day: number | null): boolean {
    if (!day || !this.selectedDate) {
      return false;
    }

    const date = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);

    return date === this.selectedDate;
  }

  getEventTypeClass(type: CalendarEvent['type']): string {
    return `event-${type}`;
  }

  formatSelectedDate(): string {
    if (!this.selectedDate) {
      return '';
    }

    return new Date(`${this.selectedDate}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private formatDate(year: number, month: number, day: number): string {
    const monthValue = String(month + 1).padStart(2, '0');
    const dayValue = String(day).padStart(2, '0');

    return `${year}-${monthValue}-${dayValue}`;
  }
}
