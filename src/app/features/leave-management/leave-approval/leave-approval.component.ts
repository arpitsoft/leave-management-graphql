import { Component, inject, AfterViewInit, OnInit, ViewChild, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LeavesService } from '../../../core/services/leaves.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ToastService } from '../../../core/services/toast.service';
import { CalculateDatePipe } from '../../../calculate-date.pipe';

interface Leave {
  id: number;
  staffId: string;
  hodId: string;
  staffName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  department: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comment?: string;
}

@Component({
  selector: 'app-leave-approval',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatInputModule, MatFormFieldModule,MatSortModule,CalculateDatePipe],
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss']
})
export class LeaveApprovalComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private authService = inject(AuthService);
  private leaveService = inject(LeavesService);
  private toastService = inject(ToastService);
  displayedColumns: string[] = ['id', 'staffName', 'fromDate', 'toDate', 'reason', 'days', 'status', 'actions'];
  leaves = signal<Leave[]>([]);
  dataSource = new MatTableDataSource<Leave>();
  pageSize = 10;
  
  ngOnInit() {
    this.loadLeaves();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLeaves() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    this.leaveService.getLeavesByDept().subscribe({
      next: (res: Leave[]) => {
        const filtered = res.filter(l => l.department === currentUser.department);
        this.leaves.set(filtered);
        this.dataSource.data = filtered;
        if (this.paginator) this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Failed to load leaves', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  approveLeave(leaveId: number) {
    if (!confirm("Are you sure you want to approve this leave?")) return;

    this.leaveService.updateLeaveStatus(leaveId, 'Approved').subscribe({
      next: () => {
        this.toastService.success('Leave applied successfully.')
        this.loadLeaves()},
      error: err => {
        console.error('Failed to approve leave', err)
        this.toastService.error('Failed to approve leave.')
      }
    });
  }

  rejectLeave(leaveId: number) {
    if (!confirm("Are you sure you want to reject this leave?")) return;
    
    this.leaveService.updateLeaveStatus(leaveId, 'Rejected').subscribe({
      next: () => {
        this.toastService.success('Leave Rejected')
        this.loadLeaves()
      },
      error: err => {
        this.toastService.error('Failed to reject leave')
        console.error('Failed to reject leave', err)
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
  }
}
