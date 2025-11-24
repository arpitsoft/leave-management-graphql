import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);

  currentUser = signal<any>(null);

  constructor() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  getToken(){
    return 'to be implemented'
  }

  get userRole() {
    return computed(() => this.currentUser()?.role ?? '');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  login(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
