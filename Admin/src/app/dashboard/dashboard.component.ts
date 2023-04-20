import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  title = 'ng-chart';
  chart: any = [];
  bar: any=[]

  constructor() {}

  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],
        datasets: [
          {
            label: '# of Revenue',
            data: [120, 190, 130, 50, 120, 30,50,70,100,40],
            backgroundColor: '#e75c6b',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
        },
      },
    });

  }
}
