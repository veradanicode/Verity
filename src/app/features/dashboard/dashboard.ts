import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Project, ProjectService } from '../../core/services/project';

import { Task, TaskService } from '../../core/services/task';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  isToday: boolean;
  hasEvent: boolean;
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

  constructor(projectService: ProjectService, taskService: TaskService) {
    this.projectService = projectService;
    this.taskService = taskService;
  }

  projects: ProjectRow[] = [];
  tasks: TaskRow[] = [];
  stats: StatCard[] = [];

  ngOnInit(): void {
    const projects = this.projectService.getProjects();

    const tasks = this.taskService.getTasks();

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

  calendarDays: CalendarDay[] = [
    { label: 'Mon', date: 7, isToday: true, hasEvent: true },
    { label: 'Tue', date: 8, isToday: false, hasEvent: false },
    { label: 'Wed', date: 9, isToday: false, hasEvent: true },
    { label: 'Thu', date: 10, isToday: false, hasEvent: true },
    { label: 'Fri', date: 11, isToday: false, hasEvent: false },
    { label: 'Sat', date: 12, isToday: false, hasEvent: false },
    { label: 'Sun', date: 13, isToday: false, hasEvent: false },
  ];

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
}
