import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Apollo } from 'apollo-angular';
import { CREATE_NOTIFICATION, UPDATE_NOTIFICATION } from '../../../core/graphql/notification.graphql';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.scss'
})
export class NotificationModalComponent implements OnInit {
  
  apollo = inject(Apollo);
  dialogRef = inject(MatDialogRef<NotificationModalComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        description: this.data.description
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const input: any = {
      ...this.form.value
    };

    if (this.data?.id) {
      input.id = this.data.id;
    }

    const mutation = this.data ? UPDATE_NOTIFICATION : CREATE_NOTIFICATION;

    this.apollo.mutate({
      mutation,
      variables: { input }
    })
    .subscribe({
      next: (res: any) => {
        const key = this.data ? 'updateNotificationMut' : 'createNotificationMut';
        this.dialogRef.close(res.data[key]); // return updated or created item
      },
      error: err => console.error("Error:", err)
    });
  }
}
