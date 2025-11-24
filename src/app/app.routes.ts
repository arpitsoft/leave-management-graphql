import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { loggedOutGuard } from './core/auth/logged-out.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [loggedOutGuard] },

  { path: 'register', component: RegisterComponent, canActivate: [loggedOutGuard] },

  {
    path: 'portal',
    loadChildren: () =>
      import('./features/management/portal-routing.module')
        .then(c => c.PortalRoutingModule),
    canActivate: [authGuard]
  },
  {
    path: 'hod',
    loadChildren: () =>
      import('./features/leave-management/leaves-routing.module')
        .then(c => c.LeavesRoutingModule),
    canActivate: [authGuard]
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./features/leave-management/leaves-routing.module')
        .then(c => c.LeavesRoutingModule),
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'login' }
];
