import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-dash-ticket',
  templateUrl: './company-dash-ticket.component.html',
  styleUrls: ['./company-dash-ticket.component.scss']
})
export class CompanyDashTicketComponent implements OnInit {

  _id:string = '';
  ticketFrequency:string = 'Monthly';
  lineData: any;
  sub: Subscription = new Subscription();
  lineChartOptions: any;
  lineChartColors:string[] = ["#0747a6", "#00ccff", '#2bc7c6', '#7C77CB'];

  public constructor(private companiesService: CompaniesService,
    public cd: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this._id = /[^/]*$/.exec(window.location.href)[0];
    this.getTicketGraph(this.ticketFrequency);
    this.lineChartOptions = {
      chart: {
        type: 'lineChart',
        height: 250,
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },

        duration: 1000,
        useInteractiveGuideline: true,
        clipVoronoi: false,
        color: (d: any, i: any) => {
          return this.lineChartColors[i]
        },
        xAxis: {
            axisLabel: '',
            tickFormat: function(d) {
                return d3.time.format('%e %b')(new Date(d))
            },
            showMaxMin: false,
            staggerLabels: false,
            axisLabelDistance: 0,
            ticks: 10,
        },

        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
                return d3.format(',.1')(d);
            },
            showMaxMin: false,
            axisLabelDistance: -10
        },
        showLegend: true,
        legend: {
          margin: {
              top: 5,
              right: 60,
              bottom: 10,
              left: 0
          }
        },
        interpolate: 'cardinal'
      }
    }
    this.lineData = [];
  }

  getTicketGraph(frequency: string) {
    let getTicket = this.companiesService.getTicketGraph(this._id, frequency.toUpperCase()).subscribe((data: any) => {
      this.ticketFrequency = frequency;
      let countOfInProgressTickets = [];
      let countOfOnHoldTickets = [];
      let countOfCompletedTickets = [];
      let countOfNewTickets = [];
      let filter_list = (data.length > 30) ? data.splice(data.length - 30, data.length) : data;
      filter_list.forEach(element => {
        countOfInProgressTickets.push([new Date(element.date), element.countOfInProgressTickets === undefined ? 0 : element.countOfInProgressTickets]);
        countOfOnHoldTickets.push([new Date(element.date), element.countOfOnHoldTickets === undefined ? 0 : element.countOfOnHoldTickets]);
        countOfCompletedTickets.push([new Date(element.date), element.countOfCompletedTickets === undefined ? 0 : element.countOfCompletedTickets]);
        countOfNewTickets.push([new Date(element.date), element.countOfNewTickets === undefined ? 0 : element.countOfNewTickets]);
      });
      this.lineData = [
        {
            key: "In Progress",
            values: countOfInProgressTickets
        },
        {
            key: "On Hold",
            values: countOfOnHoldTickets
        },
        {
            key: "Completed",
            values: countOfCompletedTickets
        },
        {
          key: "Created Tickets",
          values: countOfNewTickets
      }
      ];
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
    this.sub.add(getTicket);
  }



}
