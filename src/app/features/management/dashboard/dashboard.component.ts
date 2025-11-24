import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CardComponent } from "../../../shared/components/card/card.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';
import { LeavesService } from '../../../core/services/leaves.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService)
  userService = inject(UserService)
  leavesService = inject(LeavesService)


  currentUser = this.authService.currentUser()
  staffCount = 0;
  totalLeaves = 0
  approvedLeaves = 0
  rejectedLeaves = 0

  ngOnInit() {
    this.getTotalStaff();
    this.getStaffLeaves()
  }

  getTotalStaff() {
    this.userService.getUsersByDepartment(this.currentUser.department).subscribe(
      {
        next: (users: User[]) => {
          this.staffCount = users.length
        }
      }
    )
  }

  getStaffLeaves() {
    this.leavesService.getLeavesByDept().subscribe({
      next: (leaves: any) => {
        const staffLeaves = leaves.filter((l: any) => String(l.staffId) === String(this.currentUser.id));

        this.totalLeaves = staffLeaves.length;
        this.approvedLeaves = staffLeaves.filter((l: any) => l.status === 'Approved').length;
        this.rejectedLeaves = staffLeaves.filter((l: any) => l.status === 'Rejected').length;
      },
      error: (err: any) => console.error(err)
    });
  }
}
