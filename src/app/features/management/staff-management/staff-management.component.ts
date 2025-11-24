import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddStaffDialogComponent } from './add-staff-dialog/add-staff-dialog.component';
import { ViewStaffDialogComponent } from './view-staff-dialog/view-staff-dialog.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-staff-management',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSortModule],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.scss'
})

export class StaffManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<User>();
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  private dialoge = inject(MatDialog);
  private router = inject(Router)
  staffList = signal<User[]>([])
  pagedStaff = signal<User[]>([])
  pageSize = 10;
  pageIndex = 0;

  headers: string[] = ['fullName', 'username', 'email', 'department', 'contact', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.loadList()
  }


  loadList() {
    const currentUser = this.authService.currentUser();
    const department = currentUser?.department;

    this.userService.getUsersByDepartment(department).subscribe({
      next: (res: any) => {
        this.staffList.set(res);
        this.dataSource.data = res;
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addStaff() {
    const currentUser = this.authService.currentUser();
    const department = currentUser?.department;

    const dialoge = this.dialoge.open(AddStaffDialogComponent, {
      width: '600px',
      data: department
    })
    dialoge.afterClosed().subscribe(
      (res) => {
        if (res) this.loadList();
      }
    )
  }

  viewStaff(staff: User) {
    const dialog = this.dialoge.open(ViewStaffDialogComponent, {
      width: '600px',
      data: staff
    })
  }

  deleteStaff(id: number) {
    if (confirm('Are tou sure to delete this staff?')) {
      this.userService.deleteUser(id).subscribe(
        {
          next: () => {
            this.toastService.success('Staff deleted successfully');
            this.loadList()
          },
          error: (err: any) => {
            this.toastService.error('Something went wrong');
          }
        }
      )
    }
  }

}
