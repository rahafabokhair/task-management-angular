import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Project, User } from '../../core/models/object-model';
import { ProjectsService } from '../../shared/services/projects.service';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { get } from 'http';
import { TaskListComponent } from '../../task/task-list/task-list.component';
import { TasksService } from '../../shared/services/tasks.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TaskListComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
})
export class ProjectDetailsComponent implements OnInit {
  projectId!: number;
  projectId$: Observable<string>;
  router = inject(Router);
  route = inject(ActivatedRoute);
  projectsService = inject(ProjectsService);
  tasksService = inject(TasksService);
  userId!: number;

  projectName!: string;
  showDetail = false;
  projectData!: Project;

  formBuilder = inject(FormBuilder);
  ProjectForm: any;
  addEditProject = false;

  updatedProjectData!: Project;

  deletedPrjId!: number;

  @ViewChild('closeUpdateAdd') closeUpdateAdd: any;
  @ViewChild('closebutton') closebutton: any;
  constructor() {
    //this.projectsService.projects$.subscribe();
    this.projectId$ = this.route.params.pipe(map((params) => params['id']));
  }
  ngOnInit(): void {
    this.projectFormBuild();
    this.getCurrentUser();
    this.projectId$.subscribe((id) => {
      this.projectId = +id;
      this.getProjectPerId();
    });
  }
  projectFormBuild() {
    this.ProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  getCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id!;
  }

  getProjectPerId() {
    this.projectsService.getProjectPerId(this.projectId).subscribe((data) => {
      this.projectData = data;
      this.projectName = data.name;
    });
  }
  OnUpdateProjectPopup() {
    this.addEditProject = true;

    this.projectsService
      .getProjectPerId(this.projectId)
      .subscribe((projectData) => {
        this.updatedProjectData = projectData;
        let tempPrjForm = {
          name: projectData.name,
        };
        this.ProjectForm.patchValue(tempPrjForm);
      });
  }

  updateProject() {
    let updatedProject = {
      ...this.updatedProjectData,
      name: this.ProjectForm.value.name,
    };
    this.projectsService
      .updateProject(this.projectId, updatedProject)
      .subscribe((data) => {
        if (data) {
          this.projectName = data.name;
          this.closeUpdateAdd.nativeElement.click();
          alert('Project updated');
        }
      });
  }

  onDeletePopup() {
    this.deletedPrjId = this.projectId;
  }
  deletProject() {
    this.tasksService.deleteTaskPerProjectId(this.deletedPrjId);
    this.projectsService.deleteproject(this.deletedPrjId).subscribe((data) => {
      if (data) {
        this.closebutton.nativeElement.click();
        alert('Project Deleted');
        this.router.navigate(['project']);
      }
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.ProjectForm.controls;
  }
}
