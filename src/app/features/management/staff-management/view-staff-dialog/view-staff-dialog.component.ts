import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AddStaffDialogComponent } from '../add-staff-dialog/add-staff-dialog.component';

@Component({
  selector: 'app-view-staff-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatDialogModule],
  templateUrl: './view-staff-dialog.component.html',
  styleUrl: './view-staff-dialog.component.scss'
})
export class ViewStaffDialogComponent {
  private dialogRef: MatDialogRef<ViewStaffDialogComponent> | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public staff: any
  ) { }

  close() {
    this.dialogRef?.close();
  }
}
