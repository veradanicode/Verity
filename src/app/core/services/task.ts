import { Injectable } from '@angular/core';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  title: string;
  description: string;

  projectId: number;
  projectName: string;

  assignee: string;
  assigneeInitials: string;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Approve homepage wireframes',
      description:
        'Review the latest homepage wireframes and provide final approval before development begins.',
      projectId: 1,
      projectName: 'Riverside Rebrand',
      assignee: 'Amara Kelo',
      assigneeInitials: 'AK',
      status: 'Pending',
      priority: 'High',
      dueDate: 'Sep 7, 2026',
      createdDate: 'Sep 3, 2026',
    },

    {
      id: 2,
      title: 'Create logo concepts',
      description:
        'Develop three visual logo directions for the refreshed Riverside brand identity.',
      projectId: 1,
      projectName: 'Riverside Rebrand',
      assignee: 'Tunde Nwosu',
      assigneeInitials: 'TN',
      status: 'In Progress',
      priority: 'High',
      dueDate: 'Sep 8, 2026',
      createdDate: 'Sep 2, 2026',
    },

    {
      id: 3,
      title: 'Prepare social media templates',
      description: 'Create reusable social media templates based on the approved brand direction.',
      projectId: 1,
      projectName: 'Riverside Rebrand',
      assignee: 'Joy Okafor',
      assigneeInitials: 'JO',
      status: 'Pending',
      priority: 'Medium',
      dueDate: 'Sep 10, 2026',
      createdDate: 'Sep 4, 2026',
    },

    {
      id: 4,
      title: 'Implement new navigation',
      description:
        'Replace the existing mobile navigation with the redesigned navigation structure.',
      projectId: 2,
      projectName: 'Mobile App v2',
      assignee: 'Lara Mensah',
      assigneeInitials: 'LM',
      status: 'In Progress',
      priority: 'High',
      dueDate: 'Sep 9, 2026',
      createdDate: 'Aug 28, 2026',
    },

    {
      id: 5,
      title: 'Write release notes',
      description: 'Document the major changes and improvements included in Mobile App v2.',
      projectId: 2,
      projectName: 'Mobile App v2',
      assignee: 'Priya Shah',
      assigneeInitials: 'PS',
      status: 'Pending',
      priority: 'Medium',
      dueDate: 'Sep 15, 2026',
      createdDate: 'Sep 1, 2026',
    },

    {
      id: 6,
      title: 'Complete security review',
      description: 'Perform the final security review of the customer portal before release.',
      projectId: 3,
      projectName: 'Client Portal',
      assignee: 'Chidi Nnamdi',
      assigneeInitials: 'CN',
      status: 'Completed',
      priority: 'High',
      dueDate: 'Sep 5, 2026',
      createdDate: 'Aug 25, 2026',
    },

    {
      id: 7,
      title: 'Review customer dashboard',
      description:
        'Review the customer dashboard implementation against the approved requirements.',
      projectId: 3,
      projectName: 'Client Portal',
      assignee: 'Rita Thomas',
      assigneeInitials: 'RT',
      status: 'Completed',
      priority: 'Medium',
      dueDate: 'Sep 4, 2026',
      createdDate: 'Aug 27, 2026',
    },

    {
      id: 8,
      title: 'Collect departmental records',
      description: 'Collect outstanding financial records from all departments for the Q3 review.',
      projectId: 4,
      projectName: 'Q3 Finance Review',
      assignee: 'Michael James',
      assigneeInitials: 'MJ',
      status: 'Pending',
      priority: 'High',
      dueDate: 'Sep 12, 2026',
      createdDate: 'Sep 2, 2026',
    },

    {
      id: 9,
      title: 'Prepare variance report',
      description: 'Analyse departmental spending and prepare the Q3 budget variance report.',
      projectId: 4,
      projectName: 'Q3 Finance Review',
      assignee: 'Michael James',
      assigneeInitials: 'MJ',
      status: 'Pending',
      priority: 'Medium',
      dueDate: 'Sep 20, 2026',
      createdDate: 'Sep 3, 2026',
    },

    {
      id: 10,
      title: 'Configure deployment monitoring',
      description: 'Set up monitoring and alerts for the migrated website infrastructure.',
      projectId: 5,
      projectName: 'Website Migration',
      assignee: 'Bola Daniels',
      assigneeInitials: 'BD',
      status: 'Completed',
      priority: 'Low',
      dueDate: 'Aug 29, 2026',
      createdDate: 'Aug 20, 2026',
    },
  ];

  getTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  getTasksByProjectId(projectId: number): Task[] {
    return this.tasks.filter((task) => task.projectId === projectId);
  }

  updateTaskStatus(taskId: number, status: TaskStatus): void {
    const task = this.tasks.find((task) => task.id === taskId);

    if (task) {
      task.status = status;
    }
  }

  createTask(data: {
    title: string;
    description: string;
    projectId: number;
    projectName: string;
    assignee: string;
    assigneeInitials: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }): Task {
    const newTask: Task = {
      id: this.tasks.length === 0 ? 1 : Math.max(...this.tasks.map((task) => task.id)) + 1,
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      projectName: data.projectName,
      assignee: data.assignee,
      assigneeInitials: data.assigneeInitials,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      createdDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    this.tasks.push(newTask);

    return newTask;
  }

  updateTask(
    id: number,
    data: {
      title: string;
      description: string;
      assignee: string;
      priority: TaskPriority;
      status: TaskStatus;
      dueDate: string;
    },
  ): Task | undefined {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      return undefined;
    }

    task.title = data.title;
    task.description = data.description;
    task.assignee = data.assignee;
    task.priority = data.priority;
    task.status = data.status;
    task.dueDate = data.dueDate;

    return task;
  }

  deleteTask(id: number): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);

    return true;
  }

  deleteTasksByProjectId(projectId: number): void {
    this.tasks = this.tasks.filter((task) => task.projectId !== projectId);
  }
}
