import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError, switchMap } from 'rxjs/operators';

/** Passes HttpAuthorizationInterceptor to application-wide authorization handler */
@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.isAuthenticated$.pipe(
      switchMap(loggedIn => {
        if (loggedIn) {
          return this.auth.getTokenSilently$().pipe(
            mergeMap(token => {
              const tokenReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              });
              return next.handle(tokenReq);
            }),
            catchError(err => throwError(err))
          );
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
