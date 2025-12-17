import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';
import { UserValidators } from '../../../core/validators/user-validators';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../core/services/toast.service';
import bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  private userService = inject(UserService)
  private toastService = inject(ToastService)

  departments = ["Computer Science", "IT", "Electronics", "Mechanical", "Civil"];
  roles = ['HOD', 'STAFF'];
  registerForm!: FormGroup;
  role = signal<'HOD' | 'STAFF'>('STAFF')
  loading = signal(false)
  isview = false
  showPassword = signal(false);

  previewUrl: string | ArrayBuffer | null = null;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private userValidators: UserValidators
  ) { }


  ngOnInit(): void {
    this.initForm()
  }


  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  initForm() {
    this.registerForm = this.fb.group({
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

      contact: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      department: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      profile_image: [null],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.previewUrl = result;
        this.registerForm.patchValue({ profile_image: result });
        this.registerForm.get('profile_image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  register() {
    if (this.registerForm.valid) {
      const hashedPassword = bcrypt.hashSync(this.registerForm.value.password, 10);
      this.loading.set(true)
      const registerForm: User = {
        name: this.registerForm.value.name,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        contact: this.registerForm.value.contact,
        department: this.registerForm.value.department,
        password: hashedPassword,
        profile_image: this.registerForm.value.profile_image,
        role: this.registerForm.value.role
      }
      this.userService.register(registerForm).subscribe(
        {
          next: (res: any) => {
            this.toastService.success('Register Successfully');
            this.registerForm.reset()
            this.route.navigateByUrl('/login')
            this.loading.set(false)
          },
          error: (err: any) => {
            this.toastService.error('Something went wrong');
            this.loading.set(false)
          }
        }
      )
    }
  }
}
