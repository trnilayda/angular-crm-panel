import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { EmployeeList } from './features/employees/pages/employee-list/employee-list';
import { Reports } from './features/reports/pages/reports/reports';
import { Settings } from './features/settings/pages/settings/settings';
import { Login } from './features/auth/pages/login/login';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Dashboard,
    canActivate: [roleGuard(['admin', 'manager'])]
  },
  {
    path: 'employees',
    component: EmployeeList,
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: Reports,
    canActivate: [roleGuard(['admin', 'manager'])]
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [roleGuard(['admin'])]
  },
  {
    path: '**',
    redirectTo: ''
  }
];