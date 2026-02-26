import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { HouseholdDashboard } from './components/household-dashboard/household-dashboard';
import { CarReportDetail } from './components/car-report-detail/car-report-detail';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
    title: 'Login Page'
  },
  {
    path: '',
    component: Home,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard],
        title: 'Dashboard',

      },
      {
        path: 'household',
        component: HouseholdDashboard,
        canActivate: [AuthGuard],
        title: 'Household',

      },
      {
        path: 'vehicle/:id',
        component: CarReportDetail,
        canActivate: [AuthGuard],
        title: 'Vehicle Report'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
