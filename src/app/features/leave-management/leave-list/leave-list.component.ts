import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Leave, LeavesService } from '../../../core/services/leaves.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeavesRoutingModule } from '../leaves-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { LeaveApplyComponent } from '../leave-apply/leave-apply.component';
import { LeaveViewDialogComponent } from '../view-leave-dialog/view-leave-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CalculateDatePipe } from '../../../calculate-date.pipe';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeavesRoutingModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CalculateDatePipe,
    MatButtonModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class LeaveListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'fromDate', 'toDate', 'reason', 'status', 'action'];
  dataSource = new MatTableDataSource<Leave>([]);
  searchText: string = '';

  constructor(
    private leaveService: LeavesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves() {
    const user = this.authService.currentUser()
    if (!user) return;
    this.leaveService.getLeavesByDept().subscribe({
      next: (leaves) => {
        const leavesArray = leaves as any[];
        this.dataSource.data = leavesArray.filter(l => String(l.staffId) === String(user.id));
      },
      error: (err) => console.error('Error loading leaves', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyLeave() {
    const dialogRef = this.dialog.open(LeaveApplyComponent, {
      width: '450px',
      maxWidth: '95vw',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaves();
      }
    });
  }

  viewLeave(leave: Leave) {
    this.dialog.open(LeaveViewDialogComponent, {
      width: '400px',
      data: leave
    });
  }
}
