import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface Leave {
  id?: string;
  staffId: string;
  hodId?: string;
  staffName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  department: string;
  status?: string;
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  private authService = inject(AuthService)
  currentUser = this.authService.currentUser()
  private apiURL = 'http://localhost:3000/leaves';

  constructor(private http: HttpClient) { }

  getLeavesByDept() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return this.http.get<any[]>(`${this.apiURL}?id=0`);

    return this.http.get<any[]>(`${this.apiURL}?department=${currentUser.department}`);
  }

  updateLeaveStatus(id: number, status: string, comment: string = '') {
    return this.http.patch(`${this.apiURL}/${id}`, { status, comment });
  }

  applyLeave(leave: Leave) {
    return this.http.post<Leave>(this.apiURL, leave);
  }
}
