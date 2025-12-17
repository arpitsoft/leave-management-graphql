import { Component, inject, OnInit, signal } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LOGIN_MUTATION } from '../../../core/graphql/notification.graphql';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  user: User = {
    name: '',
    username: '',
    email: '',
    contact: 0,
    department: '',
    password: '',
    profile_image: '',
    role: ''
  }
  roles = ['HOD', 'STAFF'];
  userRole = signal('')

  private userService = inject(UserService)
  private authService = inject(AuthService)
  private toastService = inject(ToastService)
  private apollo = inject(Apollo)


  private fb = inject(FormBuilder)
  private router = inject(Router)
  loading = signal(false)

  constructor() { }

  ngOnInit(): void {
    this.intiLoginForm()
  }

  intiLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }



  // login() {
  //   if (this.loginForm.invalid) return;

  //   this.loading.set(true);
  //   const { username, password } = this.loginForm.value;

  //   this.userService.getUsers().subscribe(users => {
  //     const user = users.find(u => u.username === username && u.password === password);

  //     if (user) {
  //       this.authService.login(user);
  //       this.toastService.success('Logged In');
  //       this.router.navigate(['/portal/dashboard']);
  //     } else {
  //       this.errorMessage = 'Invalid username or password';
  //     }
  //     this.loading.set(false);
  //   }, err => {
  //     this.errorMessage = 'Server error';
  //     this.loading.set(false);
  //   });
  // }


  login() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { username, password } = this.loginForm.value;

    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { username, password }
    }).subscribe({
      next: ({ data }: any) => {
        localStorage.setItem('token', data.login.token);
        this.authService.login(data.login.user);
        this.toastService.success('Logged In');
        this.router.navigate(['/portal/dashboard']);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading.set(false);
      }
    });
  }

}
