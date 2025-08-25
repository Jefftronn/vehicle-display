import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
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
        path: 'car/:vin',
        component: CarReportDetail,
        canActivate: [AuthGuard],
        title: 'Car Report'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
