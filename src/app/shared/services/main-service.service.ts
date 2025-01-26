import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Project, Task, User } from '../../core/models/object-model';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  baseUrl = environment.server_url;

  apiService = inject(ApiService);
  constructor() {}

  // Users
  getUsers(): Observable<User[]> {
    return this.apiService.get(`${this.baseUrl}/user`);
  }

  // Projects
  getProjects(): Observable<Project[]> {
    return this.apiService.get(`${this.baseUrl}/project`);
  }

  createProject(project: Project): Observable<Project> {
    return this.apiService.post(`${this.baseUrl}/project`, project);
  }

  assignUserToProject(projectId: number, userId: number) {
    let userObj = { id: 3, name: 'bb' };
    return this.apiService.post(
      `http://localhost:3000/project/1?users`,
      userObj
    );
  }

  // Task
  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.apiService.get(`${this.baseUrl}/project/${projectId}/task`);
  }

  assignUsersToTask(taskId: number, userIds: number[]): Observable<void> {
    return this.apiService.post(`${this.baseUrl}/task/${taskId}/assign-users`, {
      userIds,
    });
  }
}
