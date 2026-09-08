import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Projects } from './features/projects/projects';
import { ProjectDetails } from './features/project-details/project-details';
import { Tasks } from './features/tasks/tasks';
import { ProjectForm } from './features/project-form/project-form';

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
        path: 'projects',
        component: Projects,
      },
      {
        path: 'projects/new',
        component: ProjectForm,
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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
