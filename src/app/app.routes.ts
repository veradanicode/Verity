import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Projects } from './features/projects/projects';
import { ProjectDetails } from './features/project-details/project-details';
import { Tasks } from './features/tasks/tasks';
import { ProjectForm } from './features/project-form/project-form';
import { TaskForm } from './features/task-form/task-form';
import { Calendar } from './features/calendar/calendar';
import { Notifications } from './features/notifications/notifications';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'dashboard/projects/new',
        component: ProjectForm,
      },
      {
        path: 'projects',
        component: Projects,
      },
      {
        path: 'projects/new',
        component: ProjectForm,
      },
      {
        path: 'projects/:id/tasks/new',
        component: TaskForm,
      },
      {
        path: 'projects/:id/tasks/:taskId/edit',
        component: TaskForm,
      },
      {
        path: 'projects/:id/edit',
        component: ProjectForm,
      },
      {
        path: 'projects/:id',
        component: ProjectDetails,
      },

      {
        path: 'tasks',
        component: Tasks,
      },
      {
        path: 'tasks/new',
        component: TaskForm,
      },
      {
        path: 'calendar',
        component: Calendar,
      },
      {
        path: 'notifications',
        component: Notifications,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
