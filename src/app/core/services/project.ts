import { Injectable } from '@angular/core';

export interface Project {
  id: number;
  name: string;
  client: string;
  description: string;
  progress: number;
  status: 'On track' | 'At risk' | 'Behind' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  startDate: string;
  owner: string;
  team: TeamMember[];
  budget: number;
  spent: number;
  objectives: string[];
  deliverables: string[];
  risks: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  online: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: 1,
      name: 'Riverside Rebrand',
      client: 'Marketing',
      description:
        'Complete brand identity redesign and campaign assets for the Riverside business unit. The project covers research, visual identity, brand guidelines, marketing collateral, and the rollout of the new identity across digital and physical touchpoints.',

      progress: 72,
      status: 'On track',
      priority: 'High',

      startDate: 'Aug 4, 2026',
      dueDate: 'Sep 12, 2026',

      owner: 'Amara Kelo',

      team: [
        {
          name: 'Amara Kelo',
          role: 'Project Lead',
          initials: 'AK',
          online: true,
        },
        {
          name: 'Tunde Nwosu',
          role: 'Designer',
          initials: 'TN',
          online: true,
        },
        {
          name: 'Joy Okafor',
          role: 'Marketing',
          initials: 'JO',
          online: false,
        },
      ],

      budget: 850000,
      spent: 612000,

      objectives: [
        'Create a refreshed visual identity',
        'Develop comprehensive brand guidelines',
        'Prepare marketing assets for launch',
        'Ensure consistent branding across digital channels',
      ],

      deliverables: [
        'Brand strategy',
        'Logo system',
        'Typography and colour system',
        'Brand guidelines',
        'Social media templates',
        'Marketing campaign assets',
      ],

      risks: ['Final approval from marketing stakeholders', 'Delay in campaign asset production'],
    },

    {
      id: 2,
      name: 'Mobile App v2',
      client: 'Product',
      description:
        'Redesign and development of the company mobile application with a focus on improving usability, performance, navigation, and customer engagement.',

      progress: 41,
      status: 'At risk',
      priority: 'High',

      startDate: 'Jul 20, 2026',
      dueDate: 'Sep 19, 2026',

      owner: 'Lara Mensah',

      team: [
        {
          name: 'Lara Mensah',
          role: 'Engineer',
          initials: 'LM',
          online: false,
        },
        {
          name: 'Priya Shah',
          role: 'Engineer',
          initials: 'PS',
          online: true,
        },
      ],

      budget: 1200000,
      spent: 780000,

      objectives: [
        'Improve application performance',
        'Modernise the user interface',
        'Reduce customer drop-off',
        'Improve navigation',
      ],

      deliverables: [
        'New application interface',
        'Updated navigation',
        'Performance improvements',
        'Analytics integration',
      ],

      risks: ['Backend integration delays', 'Limited engineering capacity'],
    },

    {
      id: 3,
      name: 'Client Portal',
      client: 'Engineering',
      description:
        'Secure customer portal for managing accounts, documents, requests, and communication with the organisation.',

      progress: 88,
      status: 'On track',
      priority: 'Medium',

      startDate: 'Jul 1, 2026',
      dueDate: 'Sep 9, 2026',

      owner: 'Chidi Nnamdi',

      team: [
        {
          name: 'Chidi Nnamdi',
          role: 'QA',
          initials: 'CN',
          online: false,
        },
        {
          name: 'Rita Thomas',
          role: 'Engineer',
          initials: 'RT',
          online: true,
        },
        {
          name: 'Bola Daniels',
          role: 'Engineer',
          initials: 'BD',
          online: true,
        },
      ],

      budget: 950000,
      spent: 810000,

      objectives: [
        'Provide customers with self-service access',
        'Improve document management',
        'Reduce support requests',
      ],

      deliverables: [
        'Customer dashboard',
        'Document management',
        'Support requests',
        'Account management',
      ],

      risks: ['Final security review'],
    },

    {
      id: 4,
      name: 'Q3 Finance Review',
      client: 'Operations',
      description:
        'Quarterly financial analysis covering operational expenditure, departmental budgets, project spending, and financial performance.',

      progress: 15,
      status: 'Behind',
      priority: 'Medium',

      startDate: 'Sep 1, 2026',
      dueDate: 'Sep 30, 2026',

      owner: 'Michael James',

      team: [
        {
          name: 'Michael James',
          role: 'Finance',
          initials: 'MJ',
          online: true,
        },
      ],

      budget: 450000,
      spent: 125000,

      objectives: [
        'Review Q3 expenditure',
        'Identify budget variances',
        'Prepare management report',
      ],

      deliverables: ['Financial analysis', 'Variance report', 'Management summary'],

      risks: ['Missing departmental financial records', 'Late submission of expense reports'],
    },

    {
      id: 5,
      name: 'Website Migration',
      client: 'Engineering',
      description:
        'Migration of legacy infrastructure to the new platform while maintaining service availability and preserving existing customer data.',

      progress: 100,
      status: 'Completed',
      priority: 'Low',

      startDate: 'Jul 10, 2026',
      dueDate: 'Aug 30, 2026',

      owner: 'Bola Daniels',

      team: [
        {
          name: 'Bola Daniels',
          role: 'Engineer',
          initials: 'BD',
          online: true,
        },
        {
          name: 'Rita Thomas',
          role: 'Engineer',
          initials: 'RT',
          online: true,
        },
      ],

      budget: 600000,
      spent: 575000,

      objectives: [
        'Migrate existing infrastructure',
        'Improve system reliability',
        'Reduce infrastructure costs',
      ],

      deliverables: [
        'Infrastructure migration',
        'Database migration',
        'Deployment automation',
        'Post-migration monitoring',
      ],

      risks: [],
    },
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: number): Project | undefined {
    return this.projects.find((project) => project.id === id);
  }

  createProject(data: {
    name: string;
    client: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    dueDate: string;
    owner: string;
    budget: number;
  }): Project {
    const newProject: Project = {
      id: this.projects.length + 1,
      name: data.name,
      client: data.client,
      description: data.description,
      progress: 0,
      status: 'On track',
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      owner: data.owner,
      team: [],
      budget: data.budget,
      spent: 0,
      objectives: [],
      deliverables: [],
      risks: [],
    };

    this.projects.push(newProject);

    return newProject;
  }

  updateProject(
    id: number,
    data: {
      name: string;
      client: string;
      description: string;
      priority: 'High' | 'Medium' | 'Low';
      startDate: string;
      dueDate: string;
      owner: string;
      budget: number;
    },
  ): Project | undefined {
    const project = this.projects.find((project) => project.id === id);

    if (!project) {
      return undefined;
    }

    project.name = data.name;
    project.client = data.client;
    project.description = data.description;
    project.priority = data.priority;
    project.startDate = data.startDate;
    project.dueDate = data.dueDate;
    project.owner = data.owner;
    project.budget = data.budget;

    return project;
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
      id: this.tasks.length + 1,
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
}
