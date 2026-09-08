import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Project, ProjectService } from '../../core/services/project';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],

    client: ['', Validators.required],

    description: ['', [Validators.required, Validators.minLength(20)]],

    priority: ['Medium', Validators.required],

    startDate: ['', Validators.required],

    dueDate: ['', Validators.required],

    owner: ['', Validators.required],

    budget: [0, [Validators.required, Validators.min(1)]],
  });

  isEditMode = false;
  projectId: number | null = null;

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Project' : 'Create New Project';
  }

  get pageDescription(): string {
    return this.isEditMode
      ? 'Update the information and details for this project.'
      : 'Add the essential information needed to create a new project.';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Save Changes' : 'Create Project';
  }

  get name() {
    return this.projectForm.controls.name;
  }

  get client() {
    return this.projectForm.controls.client;
  }

  get description() {
    return this.projectForm.controls.description;
  }

  get startDate() {
    return this.projectForm.controls.startDate;
  }

  get dueDate() {
    return this.projectForm.controls.dueDate;
  }

  get owner() {
    return this.projectForm.controls.owner;
  }

  get budget() {
    return this.projectForm.controls.budget;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        return;
      }

      const projectId = Number(id);

      if (Number.isNaN(projectId)) {
        return;
      }

      const project = this.projectService.getProjectById(projectId);

      if (!project) {
        return;
      }

      this.isEditMode = true;
      this.projectId = projectId;

      this.projectForm.patchValue({
        name: project.name,
        client: project.client,
        description: project.description,
        priority: project.priority,
        startDate: this.formatDateForInput(project.startDate),
        dueDate: this.formatDateForInput(project.dueDate),
        owner: project.owner,
        budget: project.budget,
      });
    });
  }

  submit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.getRawValue();

    const projectData = {
      name: formValue.name!,
      client: formValue.client!,
      description: formValue.description!,
      priority: formValue.priority as 'High' | 'Medium' | 'Low',
      startDate: formValue.startDate!,
      dueDate: formValue.dueDate!,
      owner: formValue.owner!,
      budget: Number(formValue.budget),
    };

    if (this.isEditMode && this.projectId !== null) {
      this.projectService.updateProject(this.projectId, projectData);

      this.router.navigate(['/projects', this.projectId]);

      return;
    }

    const project = this.projectService.createProject(projectData);

    this.router.navigate(['/projects', project.id]);
  }

  private formatDateForInput(date: string): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
