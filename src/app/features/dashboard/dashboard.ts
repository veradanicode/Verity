import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Project, ProjectService } from '../../core/services/project';

import { Task, TaskService } from '../../core/services/task';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CalendarEvent, CalendarService } from '../../core/services/calendar';

interface StatCard {
  label: string;
  value: number;
  suffix?: string;
  delta: string;
  deltaTone: 'up' | 'down' | 'flat';
  accent: 'teal' | 'coral' | 'amber' | 'green';
  icon: 'folder' | 'bolt' | 'clock' | 'check';
}

interface ProjectRow {
  name: string;
  client: string;
  progress: number;
  dueLabel: string;
  status: 'On track' | 'At risk' | 'Behind';
  initials: string[];
}

interface TaskRow {
  title: string;
  project: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  done: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  online: boolean;
}

interface CalendarDay {
  label: string;
  date: number;
  fullDate: string;
  isToday: boolean;
  hasEvent: boolean;
}

interface DashboardCalendarEvent {
  time: string;
  title: string;
  meta: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private projectService: ProjectService;
  private taskService: TaskService;
  private calendarService: CalendarService;

  constructor(
    projectService: ProjectService,
    taskService: TaskService,
    calendarService: CalendarService,
  ) {
    this.projectService = projectService;
    this.taskService = taskService;
    this.calendarService = calendarService;
  }

  projects: ProjectRow[] = [];
  tasks: TaskRow[] = [];
  stats: StatCard[] = [];
  calendarEventsData: CalendarEvent[] = [];

  ngOnInit(): void {
    const projects = this.projectService.getProjects();

    const tasks = this.taskService.getTasks();

    this.calendarEventsData = this.calendarService.getEvents();

    this.generateDashboardCalendar();

    this.projects = projects
      .filter((project) => project.status !== 'Completed')
      .slice(0, 4)
      .map((project) => ({
        name: project.name,
        client: project.client,
        progress: this.getProjectProgress(project.id),
        dueLabel: `Due ${this.formatDueDate(project.dueDate)}`,
        status: project.status === 'Completed' ? 'On track' : project.status,
        initials: project.team.slice(0, 4).map((member) => member.initials),
      }));

    this.tasks = tasks.slice(0, 5).map((task) => ({
      title: task.title,
      project: task.projectName,
      due: this.formatTaskDueDate(task.dueDate),
      priority: task.priority,
      done: task.status === 'Completed',
    }));

    this.stats = [
      {
        label: 'Total Projects',
        value: projects.length,
        delta: 'Current projects',
        deltaTone: 'up',
        accent: 'teal',
        icon: 'folder',
      },
      {
        label: 'Active Projects',
        value: projects.filter((project) => project.status !== 'Completed').length,
        delta: 'Currently active',
        deltaTone: 'flat',
        accent: 'coral',
        icon: 'bolt',
      },
      {
        label: 'Pending Tasks',
        value: tasks.filter((task) => task.status !== 'Completed').length,
        delta: 'Need attention',
        deltaTone: 'down',
        accent: 'amber',
        icon: 'clock',
      },
      {
        label: 'Completed Tasks',
        value: tasks.filter((task) => task.status === 'Completed').length,
        delta: 'Completed',
        deltaTone: 'up',
        accent: 'green',
        icon: 'check',
      },
    ];
  }
  getProjectProgress(projectId: number): number {
    const tasks = this.taskService.getTasksByProjectId(projectId);

    if (tasks.length === 0) {
      return 0;
    }

    const completed = tasks.filter((task) => task.status === 'Completed').length;

    return Math.round((completed / tasks.length) * 100);
  }

  formatDueDate(date: string): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  formatTaskDueDate(date: string): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    const today = new Date();

    if (parsedDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    if (parsedDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return parsedDate.toLocaleDateString('en-US', {
      weekday: 'short',
    });
  }

  userName = 'Amara';
  todayLabel = 'Monday, 7 September';

  team: TeamMember[] = [
    { name: 'Amara Kelo', role: 'Project Lead', initials: 'AK', online: true },
    { name: 'Tunde Nwosu', role: 'Designer', initials: 'TN', online: true },
    { name: 'Lara Mensah', role: 'Engineer', initials: 'LM', online: false },
    { name: 'Priya Shah', role: 'Engineer', initials: 'PS', online: true },
    { name: 'Chidi Nnamdi', role: 'QA', initials: 'CN', online: false },
  ];

  calendarDays: CalendarDay[] = [];
  calendarEvents: DashboardCalendarEvent[] = [];

  currentCalendarDate = new Date();

  get completionRate(): number {
    if (this.tasks.length === 0) {
      return 0;
    }

    const done = this.tasks.filter((task) => task.done).length;

    return Math.round((done / this.tasks.length) * 100);
  }

  toggleTask(task: TaskRow): void {
    const serviceTask = this.taskService
      .getTasks()
      .find((item) => item.title === task.title && item.projectName === task.project);

    if (!serviceTask) {
      return;
    }

    const newStatus = serviceTask.status === 'Completed' ? 'Pending' : 'Completed';

    this.taskService.updateTaskStatus(serviceTask.id, newStatus);

    task.done = newStatus === 'Completed';
  }

  private generateDashboardCalendar(): void {
    const today = new Date();

    // Start from Monday of the current week
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    this.calendarDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      const fullDate = this.formatDate(date);

      return {
        label: date.toLocaleDateString('en-US', {
          weekday: 'short',
        }),
        date: date.getDate(),
        fullDate,
        isToday: fullDate === this.formatDate(today),
        hasEvent: this.calendarEventsForDate(fullDate).length > 0,
      };
    });

    this.calendarEvents = this.getUpcomingCalendarEvents();
  }

  private calendarEventsForDate(date: string): any[] {
    return this.calendarEventsData.filter((event) => event.date === date);
  }

  private getUpcomingCalendarEvents(): DashboardCalendarEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.calendarEventsData
      .filter((event) => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        return eventDate >= today;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 1)
      .map((event) => ({
        time: event.time ?? 'All day',
        title: event.title,
        meta: event.projectName ?? this.getEventMeta(event),
      }));
  }
  private getEventMeta(event: CalendarEvent): string {
    switch (event.type) {
      case 'meeting':
        return 'Team meeting';

      case 'task':
        return event.projectName ?? 'Task';

      case 'project':
        return event.projectName ?? 'Project';

      default:
        return '';
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  getCurrentWeekNumber(): number {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return Math.ceil((today.getDate() + firstDayOfMonth.getDay()) / 7);
  }
  getCurrentDay(): string {
    const today = new Date();

    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }
}
