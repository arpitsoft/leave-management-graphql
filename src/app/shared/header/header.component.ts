import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule,MatIconModule,MatMenuModule,MatIconModule,MatDividerModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentUser = this.authService.currentUser;
  
  private sanitizer = inject(DomSanitizer);

  getProfileImage(): SafeUrl {
    return this.currentUser()?.profile_image  ? this.sanitizer.bypassSecurityTrustUrl(this.currentUser().profile_image)  : 'assets/img/profile-image.png';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
