import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Project, ProjectService } from '../../core/services/project';

import { Task, TaskService } from '../../core/services/task';

interface ProjectReport {
  project: Project;

  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;

  taskCompletionRate: number;
  projectProgress: number;

  budgetUsed: number;
  remainingBudget: number;

  riskLevel: 'On Track' | 'Needs Attention';
}

interface PriorityReport {
  name: string;
  count: number;
  percentage: number;
}

interface UpcomingTask {
  task: Task;
  daysRemaining: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  // --------------------------------------------------
  // SOURCE DATA
  // --------------------------------------------------

  projects: Project[] = [];
  tasks: Task[] = [];

  // --------------------------------------------------
  // PROJECT STATISTICS
  // --------------------------------------------------

  totalProjects = 0;
  completedProjects = 0;
  activeProjects = 0;

  projectCompletionRate = 0;
  averageProjectProgress = 0;

  // --------------------------------------------------
  // TASK STATISTICS
  // --------------------------------------------------

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;

  taskCompletionRate = 0;

  // --------------------------------------------------
  // DEADLINE STATISTICS
  // --------------------------------------------------

  overdueTasks = 0;
  upcomingTasks: UpcomingTask[] = [];

  // --------------------------------------------------
  // FINANCIAL STATISTICS
  // --------------------------------------------------

  totalBudget = 0;
  totalSpent = 0;
  remainingBudget = 0;
  budgetUtilization = 0;

  // --------------------------------------------------
  // PRIORITY STATISTICS
  // --------------------------------------------------

  priorityReports: PriorityReport[] = [];

  // --------------------------------------------------
  // PROJECT BREAKDOWN
  // --------------------------------------------------

  projectReports: ProjectReport[] = [];

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  // --------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();

    this.calculateReports();

    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.calculateReports();
    });
  }

  // --------------------------------------------------
  // MAIN CALCULATION
  // --------------------------------------------------

  private calculateReports(): void {
    this.calculateProjectStatistics();
    this.calculateTaskStatistics();
    this.calculateDeadlineStatistics();
    this.calculateFinancialStatistics();
    this.calculatePriorityStatistics();
    this.calculateProjectReports();
  }

  // --------------------------------------------------
  // PROJECT STATISTICS
  // --------------------------------------------------

  private calculateProjectStatistics(): void {
    this.totalProjects = this.projects.length;

    this.completedProjects = this.projects.filter(
      (project) => project.status === 'Completed',
    ).length;

    this.activeProjects = this.totalProjects - this.completedProjects;

    this.projectCompletionRate =
      this.totalProjects === 0
        ? 0
        : Math.round((this.completedProjects / this.totalProjects) * 100);

    this.averageProjectProgress =
      this.totalProjects === 0
        ? 0
        : Math.round(
            this.projects.reduce((total, project) => total + project.progress, 0) /
              this.totalProjects,
          );
  }

  // --------------------------------------------------
  // TASK STATISTICS
  // --------------------------------------------------

  private calculateTaskStatistics(): void {
    this.totalTasks = this.tasks.length;

    this.completedTasks = this.tasks.filter((task) => task.status === 'Completed').length;

    this.pendingTasks = this.totalTasks - this.completedTasks;

    this.taskCompletionRate =
      this.totalTasks === 0 ? 0 : Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  // --------------------------------------------------
  // DEADLINES
  // --------------------------------------------------

  private calculateDeadlineStatistics(): void {
    const today = this.getTodayString();

    this.overdueTasks = this.tasks.filter(
      (task) => task.status !== 'Completed' && task.dueDate < today,
    ).length;

    this.upcomingTasks = this.tasks
      .filter((task) => task.status !== 'Completed' && task.dueDate >= today)
      .map((task) => ({
        task,
        daysRemaining: this.getDaysRemaining(task.dueDate),
      }))
      .filter((item) => item.daysRemaining <= 7)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 6);
  }

  // --------------------------------------------------
  // FINANCIAL STATISTICS
  // --------------------------------------------------

  private calculateFinancialStatistics(): void {
    this.totalBudget = this.projects.reduce((total, project) => total + project.budget, 0);

    this.totalSpent = this.projects.reduce((total, project) => total + project.spent, 0);

    this.remainingBudget = this.totalBudget - this.totalSpent;

    this.budgetUtilization =
      this.totalBudget === 0 ? 0 : Math.round((this.totalSpent / this.totalBudget) * 100);
  }

  // --------------------------------------------------
  // PRIORITY ANALYSIS
  // --------------------------------------------------

  private calculatePriorityStatistics(): void {
    const priorities = ['High', 'Medium', 'Low'];

    this.priorityReports = priorities.map((priority) => {
      const count = this.tasks.filter((task) => task.priority === priority).length;

      const percentage = this.totalTasks === 0 ? 0 : Math.round((count / this.totalTasks) * 100);

      return {
        name: priority,
        count,
        percentage,
      };
    });
  }

  // --------------------------------------------------
  // PROJECT-BY-PROJECT REPORT
  // --------------------------------------------------

  private calculateProjectReports(): void {
    this.projectReports = this.projects.map((project) => {
      const projectTasks = this.tasks.filter((task) => task.projectId === project.id);

      const completedTasks = projectTasks.filter((task) => task.status === 'Completed').length;

      const overdueTasks = projectTasks.filter(
        (task) => task.status !== 'Completed' && task.dueDate < this.getTodayString(),
      ).length;

      const totalTasks = projectTasks.length;

      const taskCompletionRate =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      const budgetUsed =
        project.budget === 0 ? 0 : Math.round((project.spent / project.budget) * 100);

      const riskLevel = overdueTasks > 0 ? 'Needs Attention' : 'On Track';

      return {
        project,
        totalTasks,
        completedTasks,
        overdueTasks,
        taskCompletionRate,
        projectProgress: project.progress,
        budgetUsed,
        remainingBudget: project.budget - project.spent,
        riskLevel,
      };
    });
  }

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  private getTodayString(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getDaysRemaining(date: string): number {
    const today = new Date();
    const target = new Date(date);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const difference = target.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  // --------------------------------------------------
  // DISPLAY HELPERS
  // --------------------------------------------------

  getDeadlineLabel(days: number): string {
    if (days < 0) {
      return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
    }

    if (days === 0) {
      return 'Due today';
    }

    if (days === 1) {
      return 'Due tomorrow';
    }

    return `${days} days left`;
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }
}
