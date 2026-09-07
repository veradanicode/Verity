import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  userName = 'Amara';
  todayLabel = 'Monday, 7 September';

  stats: StatCard[] = [
    {
      label: 'Total Projects',
      value: 24,
      delta: '3 started this month',
      deltaTone: 'up',
      accent: 'teal',
      icon: 'folder',
    },
    {
      label: 'Active Projects',
      value: 9,
      delta: '5 due this week',
      deltaTone: 'flat',
      accent: 'coral',
      icon: 'bolt',
    },
    {
      label: 'Pending Tasks',
      value: 37,
      delta: '12 need review',
      deltaTone: 'down',
      accent: 'amber',
      icon: 'clock',
    },
    {
      label: 'Completed Tasks',
      value: 128,
      delta: '18 finished this week',
      deltaTone: 'up',
      accent: 'green',
      icon: 'check',
    },
  ];

  projects: ProjectRow[] = [
    {
      name: 'Riverside Rebrand',
      client: 'Marketing',
      progress: 72,
      dueLabel: 'Due Sep 12',
      status: 'On track',
      initials: ['AK', 'TN', 'JO'],
    },
    {
      name: 'Mobile App v2',
      client: 'Product',
      progress: 41,
      dueLabel: 'Due Sep 19',
      status: 'At risk',
      initials: ['LM', 'PS'],
    },
    {
      name: 'Client Portal',
      client: 'Engineering',
      progress: 88,
      dueLabel: 'Due Sep 9',
      status: 'On track',
      initials: ['RT', 'CN', 'BD', 'AK'],
    },
    {
      name: 'Q3 Finance Review',
      client: 'Operations',
      progress: 15,
      dueLabel: 'Due Sep 30',
      status: 'Behind',
      initials: ['MJ'],
    },
  ];

  tasks: TaskRow[] = [
    {
      title: 'Approve homepage wireframes',
      project: 'Riverside Rebrand',
      due: 'Today',
      priority: 'High',
      done: false,
    },
    {
      title: 'Write release notes',
      project: 'Mobile App v2',
      due: 'Today',
      priority: 'Medium',
      done: false,
    },
    {
      title: 'Review contractor invoice',
      project: 'Q3 Finance Review',
      due: 'Tomorrow',
      priority: 'Low',
      done: false,
    },
    {
      title: 'Sync with design on icons',
      project: 'Client Portal',
      due: 'Wed',
      priority: 'Medium',
      done: true,
    },
    {
      title: 'Prep sprint demo',
      project: 'Mobile App v2',
      due: 'Thu',
      priority: 'High',
      done: false,
    },
  ];

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
    const done = this.tasks.filter((t) => t.done).length;
    return Math.round((done / this.tasks.length) * 100);
  }

  toggleTask(task: TaskRow): void {
    task.done = !task.done;
  }
}
