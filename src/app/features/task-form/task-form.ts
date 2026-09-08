import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TaskPriority, TaskService, TaskStatus } from '../../core/services/task';

import { Project, ProjectService } from '../../core/services/project';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  project: Project | undefined;

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],

    description: ['', [Validators.required, Validators.minLength(10)]],

    assignee: ['', Validators.required],

    priority: ['Medium' as TaskPriority, Validators.required],

    status: ['Pending' as TaskStatus, Validators.required],

    dueDate: ['', Validators.required],
  });

  get title() {
    return this.taskForm.controls.title;
  }

  get description() {
    return this.taskForm.controls.description;
  }

  get assignee() {
    return this.taskForm.controls.assignee;
  }

  get dueDate() {
    return this.taskForm.controls.dueDate;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (Number.isNaN(id)) {
        return;
      }

      this.project = this.projectService.getProjectById(id);
    });
  }

  submit(): void {
    if (this.taskForm.invalid || !this.project) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    const assigneeInitials = this.getInitials(formValue.assignee!);

    this.taskService.createTask({
      title: formValue.title!,
      description: formValue.description!,
      projectId: this.project.id,
      projectName: this.project.name,
      assignee: formValue.assignee!,
      assigneeInitials,
      status: formValue.status as TaskStatus,
      priority: formValue.priority as TaskPriority,
      dueDate: formValue.dueDate!,
    });

    this.router.navigate(['/projects', this.project.id]);
  }

  private getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
