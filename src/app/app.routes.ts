import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

import { SigninSignupComponent } from './customer/signin-signup/signin-signup.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserCrudComponent } from './admin/user-crud/user-crud.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PageNotFoundComponent } from './shared/layout/page-not-found/page-not-found.component';
import { ProjectHomeComponent } from './project/project-home/project-home.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { ChartHomeComponent } from './chart/chart-home/chart-home.component';
import { NumTasksPerProjectComponent } from './chart/num-tasks-per-project/num-tasks-per-project.component';
import { CalendarComponent } from './calender/calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    children: [
      { path: '', component: ProjectHomeComponent },
      { path: 'project', component: ProjectHomeComponent },
      { path: 'project/:id', component: ProjectDetailsComponent },
      { path: 'task', component: TaskListComponent },
      { path: 'charthome', component: ChartHomeComponent },
       { path: 'calendar', component: CalendarComponent },
    ],
  },

  { path: 'auth', component: SigninSignupComponent },

  // {
  //   path: 'homePage',
  //   component: HomepageComponent,
  //   children: [{ path: 'project', component: ProjectsListComponent }],
  // },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'course',
        pathMatch: 'full',
      },
      { path: 'user', component: UserCrudComponent },
    ],
  },

  { path: 'not-found', component: PageNotFoundComponent },

  { path: '**', redirectTo: '/not-found' },
  // {
  //   path: 'subject-crud',
  //   component: SubjectCrudComponent,
  //   canActivate: [AuthGuard],
  // },
];
