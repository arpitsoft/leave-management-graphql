import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

export const serviceInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  const token = authService.getToken();
  const modifiedReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(modifiedReq).pipe(
    catchError((error) => {
      console.error('HTTP Error intercepted: ', error);
      let msg = 'Something went wrong!';

      if (error.status === 0) msg = 'Unable to reach server!';
      else if (error.status === 401) msg = 'Unauthorized! Please login.';
      else if (error.status === 403) msg = 'Access denied.';
      else if (error.error?.message) msg = error.error.message;
      toast.error(msg);
      return throwError(() => error);
    })
  );
};