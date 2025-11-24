
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, catchError, of } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UserValidators {

  constructor(private userService: UserService) {}


  uniqueUsername(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.userService.checkUsername(control.value).pipe(
        map(users => (users.length > 0 ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  // Check unique email
  uniqueEmail(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.userService.checkEmail(control.value).pipe(
        map(users => (users.length > 0 ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
