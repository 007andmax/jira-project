import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TicketsReport } from '../../class/tickets-reports';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TicketReportStateService } from '../ticket-report/services/ticket-report-state.service';
import * as moment from "moment";
import { ServiceReports } from '../../class/service-reports';
import { ServiceReportsItem } from '../../class/service-reports-item';
import { ReportsStateService } from 'src/ng2/app/states/reports/reports-state.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { isEmbeddedView } from '@angular/core/src/view/util';

@Component({
  selector: 'app-service-report',
  templateUrl: './service-report.component.html',
  styleUrls: ['./service-report.component.scss']
})
export class ServiceReportComponent implements OnInit {

  chartOptions;
  chartData;
  chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e", '#7f1313'];
  serviceReport: ServiceReports = new ServiceReports();
  customerTicketWithTimeSpent = true;
  overallServiceTime = [];
  selectedClient = null;
  loadingInProgress: boolean = false;
  onInit = false;
  showHeader = true;
  showServices = true;
  showProducts = true;
  currentCompany: Company;
  timeSpent: number = 0;
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    private reportsStateService: ReportsStateService,
    private devicesSateService: DevicesSateService,
    private ticketReportStateService: TicketReportStateService) { }

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
    this.ticketReportStateService.getOnShowDashboard().subscribe(data => {
      this.showHeader = data;
    })
    this.reportsStateService.serviceReport.subscribe(data => {
      this.serviceReport.setDataFromObject(data);
      console.log("data", data);
      if (this.serviceReport && this.serviceReport.services) {
        let company = this.companiesStateService.getCompanies().find(item => item.id === this.serviceReport.companyId);
        this.serviceReport.companyName = (company) ? company.name : null;
        this.calculateServicesTime(data.services);
      }
      this.serviceReport.startDate = moment(new Date(this.serviceReport.startDate)).format('ll');
      this.serviceReport.endDate = moment(new Date(this.serviceReport.endDate)).format('ll');
      this.onInit = true;
      console.log("serviceReport", this.serviceReport.services.map( item => {
        return item.ticketDevice;
      }));
    })

  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  getSelectedClientName() {
    return (this.selectedClient) ? this.selectedClient.name.toLowerCase().split(' ').join('-') : '';
  }
  parseDateService(ticketCreatedAt) {
    return moment(new Date(ticketCreatedAt)).format('DD MMM YYYY');;
  }
  parseDateTicket(ticketCreatedAt) {
    return moment(new Date(ticketCreatedAt)).format('DD MMM YYYY, hh:mm a');;
  }
  calculateServicesTime(s: Array<ServiceReportsItem>) {

    let services = JSON.parse(JSON.stringify(s));
    let list = [];
    services.forEach((element1, index1) => {
      let find = list.find(item => item.expenseName === element1.expenseName);
      if (!find) {
        //  let searchList = services.slice(index1 + 1, services.length);
        let findList = services.filter(item => item.expenseName === element1.expenseName);
        element1.serviceTime = findList.reduce(function (sum, current) {
          return sum + current.serviceTime;
        }, 0);
        list.push(element1);
      }

    });
    console.log("services", list);
    this.calculateTopTime(list);
    /*  let searchList = services.slice(index + 1, services.length);
      searchList.for
      let findIndex = searchList.findIndex(item => item.expenseName === element.expenseName);
      if (findIndex > -1) {
        element.serviceTime += searchList[findIndex].serviceTime;
        services.splice()
      }
    });*/

    /* var overallTime = {};
 
     for (var i = 0; i < services.length; i++) {
       var upd = services[i].updates;
 
       if (!upd) continue;
 
       for (var j = 0; j < upd.length; j++) {
        
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
 
     this.calculateTopTime(overallTime);*/
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
  calculateTopTime(services) {

    var timeArr = [];

    for (var i = 0; i < services.length; i++) {
      var time = {
        name: services[i].expenseName,
        time: services[i].serviceTime
      };

      timeArr.push(time);
    }

    timeArr.sort(function (a, b) {
      return b.time - a.time;
    })

    var top = timeArr.slice(0, 8);
    var rest = timeArr.slice(8);

    if (rest.length) {
      var timeRest = {
        name: 'Rest',
        time: rest.reduce(function (acc, i) {
          acc += i.time;
          return acc;
        }, 0)
      };
      top.push(timeRest);
    }

    this.overallServiceTime = top;

    this.timeSpent = top.reduce(function (acc, el) {
      acc += el.time;
      return acc;
    }, 0);


    this.drawChart(top);
  }
  public getDeviceName(data) {
    let list = this.devicesSateService.getAllDevices()[this.selectedClient.id];
    if (!list) return "";
    let find = list.find(item => item.id === data);
    return (find) ? find.hostName : "";
  }
  

  drawChart(data) {

    document.documentElement.classList.remove('no-d3-tooltip');
    this.chartData = data.map((el, i) => {
      el.color = this.chartColors[i];
      return el;
    });
    console.log("$scope.chartData", JSON.stringify(this.chartData));
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
 
  onSelectedClient(client) {
    this.selectedClient = client;

  }
  public trackByIndex(index, item) {
    return index;
  }
}
