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

  isEditMode = false;
  taskId: number | null = null;
  projects: Project[] = [];
  isGlobalCreateMode = false;

  taskForm = this.fb.group({
    projectId: [null as number | null, Validators.required],

    title: ['', [Validators.required, Validators.minLength(3)]],

    description: ['', [Validators.required, Validators.minLength(10)]],

    assignee: ['', Validators.required],

    priority: ['Medium' as TaskPriority, Validators.required],

    status: ['Pending' as TaskStatus, Validators.required],

    dueDate: ['', Validators.required],
  });

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'Create New Task';
  }

  get pageDescription(): string {
    return this.isEditMode
      ? 'Update the information and details for this task.'
      : 'Add a task to your project.';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Save Changes' : 'Create Task';
  }

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
      const projectIdParam = params.get('id');
      const taskIdParam = params.get('taskId');

      /*
       * PROJECT CONTEXT
       * /projects/:id/tasks/new
       * /projects/:id/tasks/:taskId/edit
       */
      if (projectIdParam) {
        const projectId = Number(projectIdParam);

        if (Number.isNaN(projectId)) return;

        this.project = this.projectService.getProjectById(projectId);

        if (!this.project) return;

        this.taskForm.patchValue({
          projectId: this.project.id,
        });

        /*
         * EDIT MODE
         */
        if (taskIdParam) {
          const taskId = Number(taskIdParam);

          if (Number.isNaN(taskId)) return;

          const task = this.taskService.getTaskById(taskId);

          if (!task) return;

          this.isEditMode = true;
          this.taskId = taskId;

          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            assignee: task.assignee,
            priority: task.priority,
            status: task.status,
            dueDate: this.formatDateForInput(task.dueDate),
          });
        }

        return;
      }

      /*
       * GLOBAL CREATE MODE
       * /tasks/new
       */
      if (!taskIdParam) {
        this.isGlobalCreateMode = true;
        this.projects = this.projectService.getProjects();
      }
    });
  }

  submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    /*
     * Determine which project this task belongs to.
     */
    const selectedProjectId = Number(formValue.projectId);

    const selectedProject = this.projectService.getProjectById(selectedProjectId);

    if (!selectedProject) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.project = selectedProject;

    /*
     * EDIT EXISTING TASK
     */
    if (this.isEditMode && this.taskId !== null) {
      this.taskService.updateTask(this.taskId, {
        title: formValue.title!,
        description: formValue.description!,
        assignee: formValue.assignee!,
        priority: formValue.priority as TaskPriority,
        status: formValue.status as TaskStatus,
        dueDate: formValue.dueDate!,
      });

      this.router.navigate(['/projects', this.project.id]);

      return;
    }

    /*
     * CREATE NEW TASK
     */
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
