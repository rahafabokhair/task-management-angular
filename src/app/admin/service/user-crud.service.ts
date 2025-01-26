import { inject, Injectable } from '@angular/core';
import {  User } from '../../core/models/object-model';
import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserCrudService {
  user_url = environment.server_url + '/user/';
  users$ = new BehaviorSubject<User[]>([]);
  apiService = inject(ApiService);
  constructor() {}
  clearItems() {
    this.users$.next([]);
  }
  getItems(): User[] {
    return this.users$.getValue();
  }

  getAllUsers(): Observable<User[]> {
    this.clearItems();
    return this.apiService.get(this.user_url).pipe(
      map((data) => {
        return data;
      }),
      tap((users) => {
        if (users) {
          this.users$.next(users);
        }
      })
    );
  }
  getUserPerId(id: number): Observable<User> {
    return this.apiService.get(this.user_url + id);
  }
  addItem(user: User) {
    let currentItems = this.getItems();
    currentItems.push(user);
    this.users$.next(currentItems);
  }
  addUser(subItem: User): Observable<User> {
    return this.apiService.post(this.user_url, subItem).pipe(
      tap((user) => {
        if (user) {
          this.addItem(user);
        }
      })
    );
  }
  updateItem(id: number, Item: User) {
    let currentItems = this.getItems();
    if (currentItems.length > 0) {
      let index = currentItems.findIndex((item) => item.id == id);
      if (index >= 0) {
        currentItems[index] = Item;
        this.users$.next(currentItems);
        return true;
      }
    }
    return false;
  }
  updateUser(subId: number, subItem: User): Observable<User> {
    return this.apiService.put(this.user_url + subId, subItem).pipe(
      tap((user) => {
        if (user) {
          this.updateItem(subId, user);
        }
      })
    );
  }

  deleteItem(id: number) {
    let currentItems = this.getItems();
    if (currentItems.length > 0) {
      let index = currentItems.findIndex((item) => item.id == id);
      if (index >= 0) {
        currentItems.splice(index, 1);
        this.users$.next(currentItems);
        return true;
      }
    }
    return false;
  }
  deleteUser(subId: number) {
    return this.apiService.delete(this.user_url + subId).pipe(
      tap((user) => {
        if (user) {
          this.deleteItem(subId);
        }
      })
    );
  }


}
