import { inject, Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSignoutService } from '../../admin/service/login-signout.service';
@Injectable({
  providedIn: 'root',
})
// import { } from './auth.service';
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private loginSignoutService: LoginSignoutService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.loginSignoutService.LoginStatus) {
      this.router.navigate(['auth']);
    }
    return this.loginSignoutService.LoginStatus;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (!this.loginSignoutService.LoginStatus) {
      this.router.navigate(['auth']);
    }
    return this.loginSignoutService.LoginStatus;
  }
}

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };
