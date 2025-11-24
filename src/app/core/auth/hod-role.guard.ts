import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const hodRoleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.userRole() !== 'HOD') {
    router.navigate(['/portal/dashboard']);
    return false;
  }

  return true;
};
