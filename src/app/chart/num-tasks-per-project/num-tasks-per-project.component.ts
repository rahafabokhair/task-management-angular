import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ProjectsService } from '../../shared/services/projects.service';
import { Project, User } from '../../core/models/object-model';

@Component({
  selector: 'app-num-tasks-per-project',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './num-tasks-per-project.component.html',
  styleUrl: './num-tasks-per-project.component.css',
})
export class NumTasksPerProjectComponent {
  @Input() chartData!: any[];
  projectListNames: string[] = [];
  pieListNames: string[] = [];
  
  public SystemName: string = 'MF1';
  firstCopy = false;

  public pieChartLabels: string[] = [];

  public pieChartData: any[] = [];
  public pieChartType: string = 'pie';

  // Pie
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData) {
      this.projectListNames = this.chartData.map(
        (project) => project.projectName
      );
      this.createPieChart();
    }
  }

  createPieChart() {
    this.pieChartLabels = [...new Set(this.projectListNames)];
    const labelCounts = this.chartData.map((item) => item.taskCount);
    this.pieChartData = [
      {
        data: labelCounts,
      },
    ];
  }
}
