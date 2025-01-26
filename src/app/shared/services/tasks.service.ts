import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Project, Status, Task } from '../../core/models/object-model';
import { ApiService } from '../../core/services/api.service';
import { ProjectsService } from './projects.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  task_url = environment.server_url + '/task/';
  status_url = environment.server_url + '/status/';
  tasks$ = new BehaviorSubject<Task[]>([]);
  apiService = inject(ApiService);
  projectsService = inject(ProjectsService);

  constructor() {}

  clearItems() {
    this.tasks$.next([]);
  }
  getItems(): Task[] {
    return this.tasks$.getValue();
  }

  getAllTasks(): Observable<Task[]> {
    this.clearItems();
    return this.apiService.get(this.task_url).pipe(
      map((data) => {
        return data;
      }),
      tap((tasks) => {
        if (tasks) {
          this.tasks$.next(tasks);
        }
      })
    );
  }

  getTasksPerId(id: number): Observable<Task> {
    return this.apiService.get(this.task_url + id);
  }

  addItem(task: Task) {
    let currentItems = this.getItems();
    currentItems.push(task);
    this.tasks$.next(currentItems);
  }
  addTask(subItem: Task): Observable<Task> {
    return this.apiService.post(this.task_url, subItem).pipe(
      tap((task) => {
        if (task) {
          this.addItem(task);
        }
      })
    );
  }

  updateItem(id: number, Item: Task) {
    let currentItems = this.getItems();
    if (currentItems.length > 0) {
      let index = currentItems.findIndex((item) => item.id == id);
      if (index >= 0) {
        currentItems[index] = Item;
        this.tasks$.next(currentItems);
        return true;
      }
    }
    return false;
  }
  updateTask(subId: number, subItem: Task): Observable<Task> {
    return this.apiService.put(this.task_url + subId, subItem).pipe(
      tap((task) => {
        if (task) {
          this.updateItem(subId, task);
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
        this.tasks$.next(currentItems);
        return true;
      }
    }
    return false;
  }
  deleteTask(subId: number) {
    return this.apiService.delete(this.task_url + subId).pipe(
      tap((task) => {
        if (task) {
          this.deleteItem(subId);
        }
      })
    );
  }

  getAllStatus(): Observable<Status[]> {
    return this.apiService.get(this.status_url);
  }
  deleteTaskPerProjectId(projectId: number) {
    let tasksArr: Project[] = [];
   // return this.apiService.delete(this.task_url + 'projectid=' + projectId);
    this.apiService
      .get(this.task_url + '?projectid=' + projectId)
      .subscribe((data) => {
        tasksArr = data;

        tasksArr.forEach((element) => {
          return this.apiService
            .delete(this.task_url + element.id)
            .pipe(
              tap((task) => {
                if (task) {
                  this.deleteItem(projectId);
                }
              })
            )
            .subscribe();
        });
      });
  }
}
