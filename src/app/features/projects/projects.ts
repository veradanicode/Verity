import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project, ProjectService } from '../../core/services/project';
import { TaskService } from '../../core/services/task';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  searchTerm = '';
  selectedStatus = 'All';

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  projects: Project[] = [];

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }

  get filteredProjects(): Project[] {
    return this.projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'All' || project.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
  }
  getProjectProgress(projectId: number): number {
    const tasks = this.taskService.getTasksByProjectId(projectId);

    if (tasks.length === 0) {
      return 0;
    }

    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;

    return Math.round((completedTasks / tasks.length) * 100);
  }

  getStatusClass(status: Project['status']): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
