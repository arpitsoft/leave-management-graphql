import { Component, inject } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  private userService = inject(AuthService)
  userRole = this.userService.userRole;
  sidebarOpen = false;

  menus = [
    {
      lable: 'Dashboard', role: ['HOD', 'STAFF'], route: '/dashboard',
    },
    {
      lable: 'Staff Management', role: ['HOD'], route: '/portal/staff-management',
    },
    {
      lable: 'Leave Management', role: ['HOD'], route: '/hod/leave-approvals',
    },
    {
      lable: 'Notification', role: ['HOD'], route: '/portal/notification',
    },
    {
      lable: 'Leave Management', role: ['STAFF'], route: 'staff/list',
    }
  ]



toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

}
