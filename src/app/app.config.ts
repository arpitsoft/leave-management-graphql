import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { serviceInterceptor } from './shared/interceptor/service.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([serviceInterceptor])),
    provideRouter(appRoutes),
    importProvidersFrom(MatSnackBarModule),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};
