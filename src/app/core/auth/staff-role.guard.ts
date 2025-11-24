import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const staffRoleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.userRole() !== 'STAFF') {
    router.navigate(['/portal/dashboard']);
    return false;
  }

  return true;
};
