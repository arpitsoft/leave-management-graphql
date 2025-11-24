import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserValidators } from '../../../../core/validators/user-validators';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-add-staff-dialog',
  templateUrl: './add-staff-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['./add-staff-dialog.component.scss'],
})
export class AddStaffDialogComponent {
  showPassword = false;
  previewUrl: string | null = null;
  form!: FormGroup;
  private userValidators = inject(UserValidators)
  private userService = inject(UserService)
  private toastService = inject(ToastService)


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStaffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],

      username: ['',
        {
          validators: [Validators.required, Validators.minLength(4)],
          asyncValidators: [this.userValidators.uniqueUsername()],
          updateOn: 'blur'
        }
      ],

      email: ['',
        {
          validators: [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],
          asyncValidators: [this.userValidators.uniqueEmail()],
          updateOn: 'blur'
        }
      ],
      contact: ['',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      department: [{ value: '', disabled: true }, Validators.required],
      role: ['STAFF'],
      password: ['', Validators.required],
      profile_image: this.fb.control<string | null>(null)
    });
    this.form.patchValue({ department: this.data });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.form.patchValue({ profile_image: reader.result });
    };

    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();
    this.userService.register(payload).subscribe(
      {
        next: (res: any) => {
          this.toastService.success('Staff added successfully');
          this.dialogRef.close(payload);
        },
        error: () => {

        }
      },
    )
  }
}
