import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate
} from '@angular/router';
import { Observable, merge, of } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, concatMap, every } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BatchGuard implements CanActivate {
  constructor(private auth: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean | UrlTree> | boolean {
    return this.auth.isAuthenticated$.pipe(
      tap(loggedIn => {
        if (!loggedIn) {
          this.auth.login(state.url);
        }
      }),
      concatMap(isAuthenticated => {
        const condition$ = merge(this.auth.isAdmin$, this.auth.isManufacturer$);
        return condition$.pipe(
          every(c => c === false),
          concatMap(res => of(!res)));
      })
    );
  }
}
