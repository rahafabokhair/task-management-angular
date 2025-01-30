import { Component, inject, SimpleChanges } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Task } from '../../core/models/object-model';
import { TasksService } from '../../shared/services/tasks.service';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  taskList: Task[] = [];
  taskListfilter: any[] = [];
  tasksService = inject(TasksService);

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    selectable: true,

    events: [],
  };

  constructor() {
    this.getAllTasks();

    setTimeout(() => {
      this.createNewCalendar();
    }, 200);
  }
  getAllTasks() {
    this.tasksService.getAllTasks().subscribe((data) => {
      this.taskList = data;
      this.taskListfilter = this.taskList.map((item) => {
        return { title: item.name, start: item.endDate };
      });
    });
  }
  //////////////////////////calendar///////////////////////////////

  createNewCalendar() {
    this.calendarOptions.events = [...this.taskListfilter];
  }
}
