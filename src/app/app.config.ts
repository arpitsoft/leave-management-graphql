import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HttpHeaders } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpLink } from 'apollo-angular/http';
import { provideApollo } from 'apollo-angular';

import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { setContext } from '@apollo/client/link/context';
import { sha256 } from 'crypto-hash';

import { serviceInterceptor } from './shared/interceptor/service.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([serviceInterceptor])
    ),
    provideRouter(appRoutes),
    importProvidersFrom(MatSnackBarModule),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const authLink = setContext(() => {
        const token = localStorage.getItem('token');

        return {
          headers: token
            ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
            : new HttpHeaders(),
        };
      });

      const persistedQueryLink = createPersistedQueryLink({
        sha256,
        useGETForHashedQueries: true,
      });

      return {
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          authLink,
          persistedQueryLink,
          httpLink.create({
            uri: 'http://localhost:3200/graphql',
          }),
        ]),
      };
    }),
  ],
};
