import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { AccountsReceivable } from '../../class/accounts-receivable';

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
  accountsReceivable: AccountsReceivable = new AccountsReceivable();
  headers = [];
  list = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  constructor(public cd: ChangeDetectorRef) { }

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
    this.data = [{"name":"Australia 3","time":8.92,"color":"#16a4fa"},{"name":"America","time":1.25,"color":"#ffb937"}];
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
console.log("data",data);
  }
  public onChangeTehUsers(tehusers) {
   console.log("tehusers",tehusers);

  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
}
