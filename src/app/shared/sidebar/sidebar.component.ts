import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
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


  constructor() { }
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
      lable: 'Leave Management', role: ['STAFF'], route: 'staff/list',
    }
  ]

}
