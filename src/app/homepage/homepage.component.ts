import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Project, User } from '../core/models/object-model';
import { ChartComponent } from '../chart/chart.component';
import { ProjectsService } from '../shared/services/projects.service';
import { log } from 'console';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  projectsService = inject(ProjectsService);
  projectList: Project[] = [];
  userId!: number;
  ngOnInit(): void {
    this.getCurrentUser();
    this.getAllProjects();
  }
  getCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id!;
  
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
}
