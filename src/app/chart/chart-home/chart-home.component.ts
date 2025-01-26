import { Component, inject } from '@angular/core';
import { NumTasksPerProjectComponent } from '../num-tasks-per-project/num-tasks-per-project.component';
import { Project, Status, Task, User } from '../../core/models/object-model';
import { ProjectsService } from '../../shared/services/projects.service';
import { TasksService } from '../../shared/services/tasks.service';
import { TasksPerStatusComponent } from '../tasks-per-status/tasks-per-status.component';

@Component({
  selector: 'app-chart-home',
  standalone: true,
  imports: [NumTasksPerProjectComponent, TasksPerStatusComponent],
  templateUrl: './chart-home.component.html',
  styleUrl: './chart-home.component.css',
})
export class ChartHomeComponent {
  ProjectList: Project[] = [];
  taskList: Task[] = [];
  taskStatus: Status[] = [];
  chartData!: any[];
  taskPerStauschartData!: any[];

  projectsService = inject(ProjectsService);
  tasksService = inject(TasksService);

  userId!: number;

  constructor() {
    this.getCurrentUser();
    this.getAllProjects();
    this.getAllTasks();
    this.getAllStatuses();

    setTimeout(() => {
      const filteredResults = this.getTaskCounts(
        this.ProjectList,
        this.taskList
      );
      this.chartData = filteredResults;
    }, 200);

    setTimeout(() => {
      this.taskPerStauschartData = this.getTaskCountPerStatus(this.taskList);
    }, 200);
  }

  getCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.id!;
  }

  getAllTasks() {
    this.tasksService.getAllTasks().subscribe((data) => {
      this.taskList = data.filter((item) => {
        return item.assignedUsers.includes(this.userId);
      });
    });
  }

  getAllProjects() {
    this.projectsService.getAllProjects().subscribe((data) => {
      this.ProjectList = data.filter((item) => {
        return item.users.includes(this.userId);
      });
      // this.projectListNames = this.ProjectList.map((project) => project.name);
    });
  }
  getAllStatuses() {
    this.tasksService.getAllStatus().subscribe((data) => {
      this.taskStatus = data;
    });
  }
  getTaskCounts(projects: any[], tasks: any[]): any[] {
    // Create a map to count tasks per project
    const taskCountMap: { [key: number]: number } = {};

    // Initialize the count map with project IDs
    projects.forEach((project) => {
      taskCountMap[project.id] = 0;
    });

    // Count the tasks for each project
    tasks.forEach((task) => {
      if (taskCountMap[task.projectid] !== undefined) {
        taskCountMap[task.projectid]++;
      }
    });

    // Map the result to include project names and task counts
    return projects.map((project) => ({
      projectName: project.name,
      taskCount: taskCountMap[project.id] || 0,
    }));
  }

  getTaskCountPerStatus(tasks: Task[]): any[] {
    let taskPerStatus: any[] = [];
    let countnum = 0;

    this.taskStatus.forEach((status) => {
      tasks.forEach((task) => {
        if (status.id == task.status.id) {
          countnum += 1;
        }
      });
      taskPerStatus.push({ status: status.name, count: countnum });
      countnum = 0;
    });
    return taskPerStatus;
  }
  // Usage
}
