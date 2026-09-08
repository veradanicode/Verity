import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Project, ProjectService } from '../../core/services/project';

import { Task, TaskService } from '../../core/services/task';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit {
  project: Project | undefined;

  tasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      this.project = this.projectService.getProjectById(id);

      if (this.project) {
        this.tasks = this.taskService.getTasksByProjectId(this.project.id);
      }
    });
  }

  getStatusClass(status: Project['status']): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: Task['priority']): string {
    return priority.toLowerCase();
  }

  getTaskStatusClass(status: Task['status']): string {
    return status.toLowerCase().replace(' ', '-');
  }

  toggleTask(task: Task): void {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

    this.taskService.updateTaskStatus(task.id, newStatus);

    // Refresh the project tasks
    if (this.project) {
      this.tasks = this.taskService.getTasksByProjectId(this.project.id);
    }
  }

  get completedTasks(): number {
    return this.tasks.filter((task) => task.status === 'Completed').length;
  }

  get taskCompletionRate(): number {
    if (this.tasks.length === 0) {
      return 0;
    }

    return Math.round((this.completedTasks / this.tasks.length) * 100);
  }
  get calculatedProgress(): number {
    if (this.tasks.length === 0) {
      return 0;
    }

    return Math.round((this.completedTasks / this.tasks.length) * 100);
  }

  get budgetUsedPercentage(): number {
    if (!this.project || this.project.budget === 0) {
      return 0;
    }

    return Math.round((this.project.spent / this.project.budget) * 100);
  }

  deleteTask(task: Task): void {
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id);

    if (this.project) {
      this.tasks = this.taskService.getTasksByProjectId(this.project.id);
    }
  }

  deleteProject(): void {
    if (!this.project) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${this.project.name}"?`);

    if (!confirmed) {
      return;
    }

    const deleted = this.projectService.deleteProject(this.project.id);

    if (!deleted) {
      return;
    }

    this.router.navigate(['/projects']);
  }
}
