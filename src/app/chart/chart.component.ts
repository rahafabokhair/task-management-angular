import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NumTasksPerProjectComponent } from "./num-tasks-per-project/num-tasks-per-project.component";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective, NumTasksPerProjectComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////line chart//////////////////////////////////////////////////////
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 90, 90, 90, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(20, 12, 243, 0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;

  // constructor() {}

  // ngOnInit() {}

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////bar chart//////////////////////////////////////////////////////

  public SystemName: string = 'MF1';
  firstCopy = false;

  // data
  public barChartData: Array<number> = [1, 8, 49];

  public labelMFL: Array<any> = [
    { data: this.barChartData, label: this.SystemName },
  ];
  // labels
  public barChartLabels: Array<any> = [
    '2018-01-29 10:00:00',
    '2018-01-29 10:27:00',
    '2018-01-29 10:28:00',
  ];

  constructor() {}

  public barChartOptions: any = {
    responsive: true,
    scales: {
    
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        //color: "#2756B3",
        color: '#222',

        font: {
          family: 'FontAwesome',
          size: 14,
        },
      },
      deferred: false,
    },
  };

  _barChartColors: Array<any> = [
    {
      backgroundColor: 'red',
      borderColor: 'red',
      pointBackgroundColor: 'red',
      pointBorderColor: 'red',
      pointHoverBackgroundColor: 'red',
      pointHoverBorderColor: 'red',
    },
  ];

  public ChartType = 'bar';

  public chartClicked(e: any): void {
    // console.log(e);
  }
  public chartHovered(e: any): void {
    // console.log(e);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////Pie chart//////////////////////////////////////////////////////
  // Pie

  public pieChartLabels: string[] = [
    'Chrome',
    'Safari',
    'Firefox',
    'Internet Explorer',
    'Other',
  ];
  public pieChartData: number[] = [40, 20, 20, 10, 10];
  public pieChartType: string = 'pie';

  public labelPie: Array<any> = [
    { data: this.pieChartData, label: this.SystemName },
  ];

  // events
  // public chartClickedPie(e:any):void {
  //   console.log(e);
  // }

  // public chartHoveredPie(e:any):void {
  //   console.log(e);
  // }
}
