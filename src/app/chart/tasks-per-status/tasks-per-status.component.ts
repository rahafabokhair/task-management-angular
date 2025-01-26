import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-tasks-per-status',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './tasks-per-status.component.html',
  styleUrl: './tasks-per-status.component.css',
})
export class TasksPerStatusComponent {
  @Input() taskPerStauschartData!: any[];
  statusListNames: string[] = [];
  public pieChartLabels: string[] = [];
  public pieChartData: any[] = [];
  public SystemName: string = 'MF1';
  firstCopy = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskPerStauschartData'] && this.taskPerStauschartData) {
      this.statusListNames = this.taskPerStauschartData.map(
        (item) => item.status
      );
      this.createPieChart();
    }
  }

  createPieChart() {
    this.pieChartLabels = [...new Set(this.statusListNames)];
    const labelCounts = this.taskPerStauschartData.map((item) => item.count);
    this.pieChartData = [
      {
        data: labelCounts,
      },
    ];
  }
}
