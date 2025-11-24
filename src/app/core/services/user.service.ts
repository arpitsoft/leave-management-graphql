import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiURL, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL);
  }

  getUsersByDepartment(dept: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURL}?department=${dept}&role=STAFF`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  checkUsername(username: string) {
    return this.http.get<User[]>(`${this.apiURL}?username=${username}`);
  }

  checkEmail(email: string) {
    return this.http.get<User[]>(`${this.apiURL}?email=${email}`);
  }
}
