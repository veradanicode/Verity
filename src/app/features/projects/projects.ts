import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project, ProjectService } from '../../core/services/project';

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

  constructor(private projectService: ProjectService) {}

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

  getStatusClass(status: Project['status']): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
