import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../core/models/object-model';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginSignoutService {
  apiUrl = environment.server_url + '/user/';
  apiService = inject(ApiService);

  private loggedInStatus = JSON.parse(
    localStorage.getItem('loggedIn') || 'false'
  );

  private currentUserSource = new BehaviorSubject<any>({});
  currentUser$ = this.currentUserSource.asObservable();

  constructor() {}

  setLoginStatus(value: any) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
  }

  get LoginStatus() {
    return JSON.parse(
      localStorage.getItem('loggedIn') || this.loggedInStatus.toString()
    );
  }
  // get loggedinUser() {
  //   return JSON.parse(localStorage.getItem('user') || '{}');
  // }

  Login(email: string, password: string): Observable<any> {
    return this.apiService
      .get(this.apiUrl + '?email=' + email + '&password=' + password)
      .pipe(
        map((response: User[]) => {
          const user = response[0];
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role == 'admin') {
              this.setLoginStatus(true);
            }
            this.currentUserSource.next(user);
          }
          return user;
        })
      );
  }
  signup(userData: User) {
    return this.apiService.post(this.apiUrl, userData).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));

          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }
  logout() {
    this.loggedInStatus = false;
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    this.currentUserSource.next({});
  }
}
