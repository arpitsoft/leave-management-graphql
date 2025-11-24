import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { LeavesService } from '../../../core/services/leaves.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-leave-apply',
  standalone: true,
  templateUrl: './leave-apply.component.html',
  styleUrls: ['./leave-apply.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class LeaveApplyComponent {
  minDate: Date = new Date();
  leaveForm!: FormGroup;
  staffId: string;
  hodId: string;
  staffName: string;
  department: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveApplyComponent>,
    private leavesService: LeavesService,
    private authService: AuthService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const currentUser = this.authService.currentUser();
    this.staffId = currentUser?.id || '091a';
    this.hodId = currentUser?.hodId || '705e';
    this.staffName = currentUser?.name || 'John Doe';
    this.department = currentUser?.department || 'IT';
    this.leaveForm = this.fb.group({
      leaveFrom: ['', Validators.required],
      leaveTo: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  submitLeaveForm() {
    if (this.leaveForm.invalid) {
      this.toastService.warning('All fields are mandatory')
      return;
    }

    const { leaveFrom, leaveTo, reason } = this.leaveForm.value;

    const newLeave = {
      staffId: this.staffId,
      hodId: this.hodId,
      staffName: this.staffName,
      fromDate: leaveFrom,
      toDate: leaveTo,
      reason,
      department: this.department,
      status: 'Pending',
      comment: ''
    };

    this.leavesService.applyLeave(newLeave).subscribe({
      next: () => {
        this.toastService.success('Leave applied successfully!');
        this.dialogRef.close(newLeave);
      },
      error: () => this.toastService.error('Error applying leave')
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
