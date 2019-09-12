import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import { authLogin, authLogout } from './auth.actions';
import { AuthService } from './auth.service';

export const AUTH_KEY = 'AUTH';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  login = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogin),
        tap(() => {
          this.localStorageService.setItem(AUTH_KEY, { isAuthenticated: true });
          this.authService.login();
        })
      ),
    { dispatch: false }
  );

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogout),
        tap(() => {
          this.localStorageService.setItem(AUTH_KEY, {
            isAuthenticated: false
          });
          this.authService.logout();
        })
      ),
    { dispatch: false }
  );
}
