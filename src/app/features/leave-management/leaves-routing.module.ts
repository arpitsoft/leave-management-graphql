import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hodRoleGuard } from '../../core/auth/hod-role.guard';
import { staffRoleGuard } from '../../core/auth/staff-role.guard';

const routes: Routes = [
  {
    path: 'leave-approvals',
    loadComponent: () =>
      import('./leave-approval/leave-approval.component').then(m => m.LeaveApprovalComponent),
    canActivate: [hodRoleGuard],
    data: { role: 'HOD' }
  },
  {
    path: 'list',
    canActivate: [staffRoleGuard],
    data: { role: 'STAFF' },
    loadComponent: () =>
      import('./leave-list/leave-list.component').then(m => m.LeaveListComponent)

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
