import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, User } from '../../core/models/object-model';
import { MainServiceService } from '../../shared/services/main-service.service';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { get } from 'http';
import { ProjectsService } from '../../shared/services/projects.service';
import { UserCrudService } from '../../admin/service/user-crud.service';

@Component({
  selector: 'app-project-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule,RouterLink],
  templateUrl: './project-home.component.html',
  styleUrl: './project-home.component.css',
})
export class ProjectHomeComponent {

  projectsService = inject(ProjectsService);
  userCrudService = inject(UserCrudService);
  projectList: Project[] = [];
  users: User[] = [];

  formBuilder = inject(FormBuilder);
  ProjectForm: any;
  addEditProject = false;
  userId!: number;
  userObj!: User;
  userName: any;
  @ViewChild('closeUpdateAdd') closeUpdateAdd: any;
  constructor() {
    this.getAllProjects();
    this.projectFormBuild();
    this.getCurrentUser();
    this.loadUsers();
  }
  projectFormBuild() {
    this.ProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  loadUsers() {
    this.userCrudService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  getCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id!;
    this.userObj = user;
  }

  getAllProjects() {
    this.projectsService.getAllProjects().subscribe((data) => {
      this.projectList = data.filter((item) => {
        return item.users.includes(this.userId);
      });
    });

    this.projectsService.projects$.subscribe((data) => {
      this.projectList = data.filter((item) => {
        return item.users.includes(this.userId);
      });
    });
  }

  OnAddProjectPopup() {
    this.addEditProject = false;
    this.ProjectForm.reset();
  }
  addNewProject() {
    let projectData: Project = {
      name: this.ProjectForm.value.name,
      users: [this.userId],
    };
    this.projectsService.addProject(projectData).subscribe((data) => {
      if (data) {
        this.closeUpdateAdd.nativeElement.click();
      }
    });
  }
  unAssignUserToProject(value: any, project: Project) {
    let projectData: Project = {
      ...project,
      users: project.users.filter((item) => {
        return item != value;
      }),
    };

    this.projectsService
      .updateProject(project.id!, projectData)
      .subscribe();
    this.getAllProjects();
  }
  assignUserToProject(value: any, project: Project) {
    project.users.push(+value);

    this.projectsService
      .updateProject(project.id!, project)
      .subscribe((data) => {
        console.log(data);
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ProjectForm.controls;
  }
}
