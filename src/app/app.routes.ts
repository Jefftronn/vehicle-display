import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { Dashboard } from './components/dashboard/dashboard';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
    title: 'Login Page'
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
    title: 'Dashboard'
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
