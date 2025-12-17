import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hodRoleGuard } from '../../core/auth/hod-role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'staff-management',
    canActivate: [hodRoleGuard],
    loadComponent: () => import('./staff-management/staff-management.component').then(m => m.StaffManagementComponent)
  },
    {
    path: 'notification',
    canActivate: [hodRoleGuard],
    loadComponent: () => import('../notifications/notifications.component').then(m => m.NotificationsComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
