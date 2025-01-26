import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Project } from '../../core/models/object-model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  project_url = environment.server_url + '/project/';
  projects$ = new BehaviorSubject<Project[]>([]);
  apiService = inject(ApiService);
  constructor() {}

  clearItems() {
    this.projects$.next([]);
  }
  getItems(): Project[] {
    return this.projects$.getValue();
  }

  getAllProjects(): Observable<Project[]> {
    this.clearItems();
    return this.apiService.get(this.project_url).pipe(
      map((data) => {
        return data;
      }),
      tap((projects) => {
        if (projects) {
          this.projects$.next(projects);
        }
      })
    );
  }

  getProjectPerId(id: number): Observable<Project> {
    return this.apiService.get(this.project_url + id);
  }

  addItem(project: Project) {
    let currentItems = this.getItems();
    currentItems.push(project);
    this.projects$.next(currentItems);
  }
  addProject(subItem: Project): Observable<Project> {
    return this.apiService.post(this.project_url, subItem).pipe(
      tap((project) => {
        if (project) {
          this.addItem(project);
        }
      })
    );
  }


    updateItem(id: number, Item: Project) {
      let currentItems = this.getItems();
      if (currentItems.length > 0) {
        let index = currentItems.findIndex((item) => item.id == id);
        if (index >= 0) {
          currentItems[index] = Item;
          this.projects$.next(currentItems);
          return true;
        }
      }
      return false;
    }
    updateProject(subId: number, subItem: Project): Observable<Project> {
      return this.apiService.put(this.project_url + subId, subItem).pipe(
        tap((project) => {
          if (project) {
            this.updateItem(subId, project);
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
          this.projects$.next(currentItems);
          return true;
        }
      }
      return false;
    }
    deleteproject(subId: number) {
      return this.apiService.delete(this.project_url + subId).pipe(
        tap((project) => {
          if (project) {
            this.deleteItem(subId);
          }
        })
      );
    }
 

}
