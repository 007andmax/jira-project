import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { AccountsReceivable } from '../../class/accounts-receivable';
import { TicketsReport } from '../../class/tickets-reports';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import * as moment from "moment";
import { Company } from 'src/ng2/app/interfaces/company/company';
import { TicketReportStateService } from './services/ticket-report-state.service';
@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketReportComponent implements OnInit {
  chartOptions;
  chartData;
  chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e", '#7f1313'];
  ticketsReport: TicketsReport = new TicketsReport();
  customerTicketWithTimeSpent = true;
  overallServiceTime = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  onInit = false;
  showHeader = true;
  showServices = true;
  showProducts = true;
  currentCompany:Company;
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    private ticketReportStateService:TicketReportStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 350,
        donut: true,
        x: (d) => { return d.name; },
        y: (d) => { return d.time; },
        showLabels: false,
        color: (d, i) => {
          return this.chartColors[i]
        },

        pie: {
          startAngle: (d) => { return d.startAngle },
          endAngle: (d) => { return d.endAngle }
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
  //  this.chartData = [{ "name": "Australia 3", "time": 8.92, "color": "#16a4fa" }, { "name": "America", "time": 1.25, "color": "#ffb937" }];
this.ticketReportStateService.getOnShowDashboard().subscribe(data => {
  this.showHeader = data;
}) 
this.ticketReportStateService.getOnShowServices().subscribe(data => {
  this.showServices = data;
}) 
this.ticketReportStateService.getOnShowProducts().subscribe(data => {
  this.showProducts = data;
}) 
}
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    console.log("data", data);
    this.ticketsReport.setData(data);

    //  this.ticketsReport.showTotalTicketAmount = $scope.customerTicketShowTotalTicketAmount;
    /* if (resp.ticketsPerDate && resp.ticketsPerDate.length) {
       $scope.reportChartData = [];
       for (var i = 0; i < resp.ticketsPerDate.length; i++) {
         var item = resp.ticketsPerDate[i];
         if (item.ticketResolved) {
           $scope.reportChartData.push(item);
         }
       }
     }*/

    if (this.ticketsReport && this.ticketsReport.tickets) {
      let company = this.companiesStateService.getCompanies().find(item => item.id === this.ticketsReport.companyId);
      this.ticketsReport.companyName = (company) ? company.name : null;

    /*  this.ticketsReport.tickets = this.ticketsReport.tickets.map(function (ticket) {
        // ticket.username = UsersService.getOneById(ticket.clientUserId);
        //ticket.techUsername = UsersService.getOneById(ticket.techUserId);
        ticket.ticketCreatedAt = moment(new Date(ticket.ticketCreatedAt)).format('DD MMM YYYY, hh:mm a');

        return ticket;
      });*/

      this.calculateServicesTime(data.tickets);
    }

    /* if ($rootScope.customerTicketShowTotalTicketAmount === false) {
       this.ticketsReport.hideTotalTickets = true;
     }
 */
    // this.showHeader = this.customerTicketWithTimeSpent;
    this.ticketsReport.startDate = moment(new Date(this.ticketsReport.startDate)).format('ll');
    this.ticketsReport.endDate = moment(new Date(this.ticketsReport.endDate)).format('ll');
    this.onInit = true;
    console.log("ticketsReport",this.ticketsReport);
  }
  getSelectedClientName() {
    return  (this.selectedClient) ?  this.selectedClient.name.toLowerCase().split(' ').join('-') : '';
  }
  parseDateTciket(ticketCreatedAt) {
    return moment(new Date(ticketCreatedAt)).format('DD MMM YYYY, hh:mm a');;
  }
  calculateServicesTime(tickets) {
    var overallTime = {};

    for (var i = 0; i < tickets.length; i++) {
      var upd = tickets[i].updates;

      if (!upd) continue;

      for (var j = 0; j < upd.length; j++) {
        if (upd[j].type === 'SERVICE') {
          var exp = upd[j].expenses;

          if (!exp) continue;

          for (var k = 0; k < exp.length; k++) {
            if (exp[k].isServiceExpense) {
              var name = exp[k].name;
              var time = exp[k].totalQuantity;

              if (overallTime[name]) {
                overallTime[name] += time;
              } else {
                overallTime[name] = time;
              }
            }
          }
        }
      }
    }

    this.calculateTopTime(overallTime);
  }
  formatResponseTime(time) {
    if (!time && time !== 0) return;
    var hours = Math.floor(time / 60);
    var minutes = time % 60;
    return addZero(hours) + ':' + addZero(minutes) + ' hr';

    function addZero(num) {
      if (String(num).length < 2) {
        return '0' + num;
      }
      return num;
    }
  };
  calculateTopTime(timeObj) {
    var keys = Object.keys(timeObj);
    var timeArr = [];

    for (var i = 0; i < keys.length; i++) {
      var time = {
        name: keys[i],
        time: timeObj[keys[i]]
      };

      timeArr.push(time);
    }

    timeArr.sort(function (a, b) {
      return b.time - a.time;
    })

    var top = timeArr.slice(0, 8);
    var rest = timeArr.slice(8);

    if (rest.length) {
      var time = {
        name: 'Rest',
        time: rest.reduce(function (acc, i) {
          acc += i.time;
          return acc;
        }, 0)
      };
      top.push(time);


    }

    this.overallServiceTime = top;

    this.ticketsReport.timeSpent = top.reduce(function (acc, el) {
      acc += el.time;
      return acc;
    }, 0);


    this.drawChart(top);
  }
  calcTaxes(taxes, sum) {
    var rate = 0;
    taxes.forEach(function (tax) {
      rate += tax.rate;
    });
    return (sum / 100) * rate;
  };

  drawChart(data) {
    if (!this.ticketsReport.timeSpent) {
      data = [{
        time: 1,
        name: 'No data available'
      }];
      document.documentElement.classList.add('no-d3-tooltip');
    } else {
      document.documentElement.classList.remove('no-d3-tooltip');
    }
    this.chartData = data.map((el, i) => {
      el.color = this.chartColors[i];
      return el;
    });
    console.log("$scope.chartData", JSON.stringify(this.chartData));
  }
  public getFloorAverageResponseTime() {
    return Math.floor(this.ticketsReport.averageResponseTime);
  }
  getDurationFilter(quanity) {
    var minutes: string | number = (quanity * 60) % 60;
    var hours: string | number = Math.floor(quanity);
    hours = String(hours).length < 2 ? '0' + hours : hours;
    minutes = String(minutes).length < 2 ? '0' + minutes : minutes;
    return hours + ':' + minutes;
  };
  public getUserName(data) {
    let user = this.usersStateService.getAllUsers().find(item => item.id === data);
    return (user) ? `${user.firstName} ${user.lastName}` : "";
  }
  public onChangeTehUsers(tehusers) {
    console.log("tehusers", tehusers);

  }
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  public trackByIndex(index, item) {
    return index;
  }
}
