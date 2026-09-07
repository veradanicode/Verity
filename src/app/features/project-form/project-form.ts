import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);

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

  submit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    console.log('Project form submitted:', this.projectForm.value);
  }
}
