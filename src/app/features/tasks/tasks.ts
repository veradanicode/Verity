import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Task, TaskPriority, TaskService, TaskStatus } from '../../core/services/task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private tasksSubscription?: Subscription;

  searchTerm = '';

  selectedStatus = 'All';

  selectedPriority = 'All';

  selectedProject = 'All';

  constructor(private taskService: TaskService) {}

  ngOnDestroy(): void {
    this.tasksSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  get projects(): string[] {
    return [...new Set(this.tasks.map((task) => task.projectName))];
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter((task) => {
      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        task.projectName.toLowerCase().includes(search) ||
        task.assignee.toLowerCase().includes(search);

      const matchesStatus = this.selectedStatus === 'All' || task.status === this.selectedStatus;

      const matchesPriority =
        this.selectedPriority === 'All' || task.priority === this.selectedPriority;

      const matchesProject =
        this.selectedProject === 'All' || task.projectName === this.selectedProject;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
  }

  setPriority(priority: string): void {
    this.selectedPriority = priority;
  }

  setProject(project: string): void {
    this.selectedProject = project;
  }

  getStatusClass(status: TaskStatus): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: TaskPriority): string {
    return priority.toLowerCase();
  }

  toggleTask(task: Task): void {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

    this.taskService.updateTaskStatus(task.id, newStatus);
  }

  deleteTask(task: Task): void {
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id);
  }
}
