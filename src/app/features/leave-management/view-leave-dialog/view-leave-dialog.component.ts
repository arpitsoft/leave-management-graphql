import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-view-dialog',
  standalone: true,
  imports: [ 
    CommonModule,
    MatDialogModule,
    MatButtonModule,],
  templateUrl: './view-leave-dialog.component.html',
  styleUrls: ['./view-leave-dialog.component.scss']
})
export class LeaveViewDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LeaveViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
