import { Component, inject, Input, input, ViewChild } from '@angular/core';
import { Project, Status, Task, User } from '../../core/models/object-model';
import { TasksService } from '../../shared/services/tasks.service';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../shared/services/projects.service';
import { ProjectFilterPipe } from '../../shared/pipes/project-filter.pipe';
import { UserCrudService } from '../../admin/service/user-crud.service';
import { FilterTaskPerProjIdPipe } from '../../shared/pipes/filter-task-per-proj-id.pipe';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { ExpiredatePipe } from '../../shared/pipes/expiredate.pipe';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ProjectFilterPipe,
    FilterTaskPerProjIdPipe,
    FilterPipe,
    FormsModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasksService = inject(TasksService);
  projectsService = inject(ProjectsService);
  userCrudService = inject(UserCrudService);
  formBuilder = inject(FormBuilder);

  taskList: Task[] = [];
  projectList: Project[] = [];
  statusList: Status[] = [];
  users: User[] = [];

  userId!: number;
  taskForm: any;
  addEditTask = false;
  projectName!: string;
  userName = '';
  UptTaskId!: number;
  deletedTskId!: number;
  getStartDate!: Date;
  assignedUsersArr: number[] = [];
  completedCheck = false;
  expired = false;
  @ViewChild('closeUpdateAdd') closeUpdateAdd: any;
  @ViewChild('closebutton') closebutton: any;

  @Input('projectId') projectId: any;
  @Input('showcolumns') showcolumns: any;

  constructor() {
    this.getCurrentUser();
    this.getAllTasks();
    this.getAllStatus();
    this.FormBuild();
    this.getAllProjects();
    this.loadUsers();
  }

  FormBuild() {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      project: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }
  getAllTasks() {
    this.tasksService.getAllTasks().subscribe((data) => {
      this.taskList = data.filter((item) => {
        return item.assignedUsers.includes(this.userId);
      });
    });

    this.tasksService.tasks$.subscribe((data) => {
      this.taskList = data.filter((item) => {
        return item.assignedUsers.includes(this.userId);
      });
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
    this.userName = user.name;
  }
  getAllProjects() {
    this.projectsService.getAllProjects().subscribe((data) => {
      this.projectList = data.filter((item) => {
        return item.users.includes(this.userId);
      });
    });
  }

  getAllStatus() {
    this.tasksService.getAllStatus().subscribe((data) => {
      this.statusList = data.filter((item) => {
        return item.id != 3;
      });
    });
  }
  OnAddTaskPopup() {
    this.addEditTask = false;
    this.taskForm.reset();
  }
  addNewTask() {
    let currentDate = new Date();
    let taskData: Task = {
      name: this.taskForm.value.name,
      assignedUsers: [this.userId],
      startDate: currentDate,
      endDate: this.taskForm.value.endDate,
      projectid: this.taskForm.value.project,
      checkCompleted: false,
      status: this.taskForm.value.status,
    };
    this.tasksService.addTask(taskData).subscribe((data) => {
      if (data) {
        this.closeUpdateAdd.nativeElement.click();
      }
    });
  }

  assignToUser(value: any, task: Task) {
    task.assignedUsers.push(+value);
    console.log(task.projectid);

    let ProjectItem = this.projectList.find((item) => {
      return item.id == task.projectid;
    });
    ProjectItem?.users.push(+value);

    this.projectsService
      .updateProject(task.projectid, ProjectItem!)
      .subscribe();

    this.tasksService.updateTask(task.id!, task).subscribe();
  }

  OnUpdateSubPopup(taskId: number) {
    this.addEditTask = true;
    //this.statusListFilter = this.statusList;
    this.UptTaskId = taskId;
    this.tasksService.getTasksPerId(taskId).subscribe((taskdata) => {
      this.getStartDate = taskdata.startDate;
      this.assignedUsersArr = taskdata.assignedUsers;
      let tempTskForm = {
        name: taskdata.name,
        assignedUsers: taskdata.assignedUsers,
        startDate: taskdata.startDate,
        endDate: taskdata.endDate,
        projectId: taskdata.projectid,
        checkCompleted: taskdata.checkCompleted,
        status: taskdata.status,
      };
      this.taskForm.patchValue(tempTskForm);
    });
  }

  updateTask() {
    let checkCompletedval = true ? this.taskForm.value.status.id == 3 : false;
    let updatedTask: Task = {
      name: this.taskForm.value.name,
      assignedUsers: this.assignedUsersArr,
      startDate: this.getStartDate,
      endDate: this.taskForm.value.endDate,
      projectid: this.taskForm.value.project,
      checkCompleted: checkCompletedval,
      status: this.taskForm.value.status,
    };
    this.tasksService
      .updateTask(this.UptTaskId, updatedTask)
      .subscribe((data) => {
        if (data) {
          this.closeUpdateAdd.nativeElement.click();
          alert('Task updated');
        }
      });
  }

  onDeletePopup(taskId: number) {
    this.deletedTskId = taskId;
  }

  deleteTask() {
    this.tasksService.deleteTask(this.deletedTskId).subscribe((data) => {
      if (data) {
        this.closebutton.nativeElement.click();
        alert('Project Deleted');
      }
    });
  }

  onCheckboxChange(taskItem: any, index: number): void {
    //console.log(`Row ${index + 1} selected state:`, taskItem.completedCheck);
    let statusObj = taskItem.status;

    if (taskItem.checkCompleted) {
      statusObj = {
        id: 3,
        name: 'completed',
      };
    } else {
      statusObj = {
        id: 1,
        name: 'start',
      };
    }

    let task: Task = {
      ...taskItem,
      checkCompleted: taskItem.checkCompleted,
      status: statusObj,
    };

    this.tasksService.updateTask(taskItem.id, task).subscribe();
  }


  checkIfTaskExpired(endDate: string): boolean {
    const currentDate = new Date();
    const taskEndDate = new Date(endDate); // Convert endDate string to a Date object
  
    return currentDate > taskEndDate; // Return true if current date is greater than end date
  }

  get f(): { [key: string]: AbstractControl } {
    return this.taskForm.controls;
  }
}
