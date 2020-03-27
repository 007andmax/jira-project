import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketReportComponent implements OnInit {
  options;
  data;
  chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e",'#7f1313'];
  constructor() { }

  ngOnInit() {
    this.options = {
      chart: {
        type: 'pieChart',
        height: 350,
        donut: true,
        x: (d) =>{return d.name;},
        y:  (d) =>{return d.time;},
        showLabels: false,
        color:  (d,i) =>{
            return  this.chartColors[i]
        },

        pie: {
            startAngle:  (d) => { return d.startAngle },
            endAngle:  (d) => { return d.endAngle }
        },
        showLegend: false,
        duration: 500,
        legend: {
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
      }
    }
    this.data = [
      {
        key: "One",
        y: 5
    },
    {
        key: "Two",
        y: 2
    },
    {
        key: "Three",
        y: 9
    },
    {
        key: "Four",
        y: 7
    },
    {
        key: "Five",
        y: 4
    },
    {
        key: "Six",
        y: 3
    },
    {
        key: "Seven",
        y: .5
    }
    ];
  }

}
