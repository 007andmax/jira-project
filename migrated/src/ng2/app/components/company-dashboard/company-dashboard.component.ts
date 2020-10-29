import { NgModule, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TicketProfileFormService } from '../../../../ng2/app/components/tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompanyProfile } from '../companies/class/company-profile';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { DevicesSateService } from '../../states/devices/devices-sate.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
declare let d3: any;
@Component({
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@NgModule({
  imports: [NgbDropdownToggle,NgbModal]  
})
export class CompanyDashboardComponent implements OnInit {
  @ViewChild('timePicker1') timePicker1: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker2') timePicker2: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker3') timePicker3: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker4') timePicker4: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker5') timePicker5: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker6') timePicker6: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker7') timePicker7: TicketProfileUpdatesServiceTimepickerComponent;
  currentService: TicketProfileFormService = new TicketProfileFormService();
  chartOptions: any;
  lineChartOptions: any;
  data: any;
  lineData: any;
  chartColors = ["#0747a6", "#00ccff", '#cdecff'];
  lineChartColors = ["#0747a6", "#00ccff", '#2bc7c6'];
  _id = '';
  companyOpen = 'Close';
  totalTickets = 0;
  averageResponseTime = '';
  public countUsers: number = 0;
  public countDevices: number = 0;
  showArchivedCompanies = false;
  recentInvoiceList = [];
  contractsList = [];
  sub: Subscription = new Subscription();
  totalRevenue = 0;
  invoicedSum = 0;
  collectedSum = 0;
  outstandingSum = 0;
  addresses = '';
  phoneNumber = '';
  name = '';
  month = '12'
  ticketFrequency = 'Monthly';
  primaryContact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: ''
  };
  tags = [];
  aa;
  workingDays = [];
  public companyDetail: CompanyProfile;
  constructor(private modalService: NgbModal,
    private companiesService: CompaniesService,
    private devicesState: DevicesSateService,
    private usersStateService: UsersStateService,
    private route: ActivatedRoute,
    private companiesStateService: CompaniesStateService) {}
  closeResult = '';

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
  openMap(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal map'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

  ngOnInit() {
    this._id = /[^/]*$/.exec(window.location.href)[0];
    setTimeout(() => {
      this.getCompanyDetails();
      this.getRecentInvoiceList();
      this.getContractsList();
      this.getInvoiceRevenue('12');
      this.getTicketGraph(this.ticketFrequency);
      if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
      let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
        this.showArchivedCompanies = false;
        this.onGetUsersCount(data);
      })
      this.sub.add(getOnUsers);
      if (this.devicesState.getAllDevices()) this.onGetDevicesCount(this.devicesState.getAllDevices());
      let getOnDevices = this.devicesState.getOnDevices().subscribe((data) => {
        this.showArchivedCompanies = false;
        this.onGetDevicesCount(data);
      })
      this.sub.add(getOnDevices);
    }, 100);
    
    this.currentService = new TicketProfileFormService();
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 200,
        donut: true,
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          return this.chartColors[i]
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
        },
        donutRatio: '0.68'
      }
    }
    this.lineChartOptions = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },

        duration: 300,
        useInteractiveGuideline: true,
        clipVoronoi: false,
        color: (d: any, i: any) => {
          return this.lineChartColors[i]
        },
        xAxis: {
            axisLabel: 'X Axis',
            tickFormat: function(d) {
                return d3.time.format('%d/%m/%y')(new Date(d))
            },
            showMaxMin: false,
            staggerLabels: true
        },

        yAxis: {
            axisLabel: 'Y Axis',
            tickFormat: function(d){
                return d3.format(',.1')(d);
            },
            axisLabelDistance: 20
        },
        showLegend: false,
        interpolate: 'cardinal'
      }
    }
    this.data = [];
    this.lineData = [];
  } 

  public onChangeStartTimePicker(data) {
    this.currentService.setDurationStart(data);
  }

  public onChangeEndTimePicker(data) {
    this.currentService.setDurationEnd(data);
  }

  getCompanyDetails() {
    // 07ed6152-997c-4389-81f9-a261e262e307
    // d9adf435-0f98-41cc-98a2-22ddf4a83a2f
    let getCompany = this.companiesService.getCompany(this._id).subscribe((data: CompanyProfile) => {
      this.companyDetail = data;
      this.name = this.companyDetail.name == undefined ? '' : this.companyDetail.name;
      this.addresses = this.companyDetail.addresses.length > 0 ? this.companyDetail.addresses[0].address : '';
      this.phoneNumber = this.companyDetail.addresses.length > 0 && this.companyDetail.addresses[0].phoneNumbers.length !== 0 ? this.companyDetail.addresses[0].phoneNumbers[0].number : '';
      this.totalTickets = this.companyDetail['companyTicketStatistic'].totalTickets;
      this.averageResponseTime = this.companyDetail['companyTicketStatistic'].averageResponseTime;
      this.tags = this.companyDetail.tags;
      this.primaryContact = {
        firstName: this.companyDetail.contacts[0].firstName,
        lastName: this.companyDetail.contacts[0].lastName,
        email: this.companyDetail.contacts[0].primaryEmail,
        phoneNumber: this.companyDetail.contacts[0].phoneNumbers[0],
        avatar: this.companyDetail.contacts[0].avatar
      }
      let day = moment(new Date()).format('dddd');
      this.workingDays = this.companyDetail.workingDays;
      if (this.workingDays.length !== 0) {
        let arr = this.workingDays.filter(val => val.dayOfWeek.toLowerCase() === day.toLowerCase())
        if (arr.length !== 0 && arr[0].startTime !== 0 && arr[0].endTime !== 0) {
          this.companyOpen = 'Opens';
        } else {
          this.companyOpen = 'Close';
        }
        this.workingDays.forEach((element, index) => {
          if (element.startTime !== 0 && element.endTime !== 0) {
            element.timing = `${this.timeFormatter(element.startTime)} ${this.getTimeFormat(element.startTime)} - ${this.timeFormatter(element.endTime)} ${this.getTimeFormat(element.endTime)}`
            let s1 = this.timeFormatter(element.startTime) + ':00 ' + this.getTimeFormat(element.startTime)
            element.sTime = new Date('01/01/1990 ' + s1)
            let e1 = this.timeFormatter(element.endTime) + ':00 ' + this.getTimeFormat(element.endTime)
            element.eTime = new Date('01/01/1990 ' + e1)
            element.checked = true
          }
          
          // let abc = this.timeFormatter(element.endTime) + ':00 ' + this.getTimeFormat(element.endTime)
          // this.aa = new Date('01/01/1990 ' + abc)
          // let end1 = new Date();
          // let time = aa.getTime();
          // var diff =(end1.getTime() - aa.getTime()) / 1000;
          // diff /= 60;
          // if () {

          // }
        });
      }
      
    })
    this.sub.add(getCompany);
  }

  getCharacter(name) { 
    return name[0] + name[1];
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  private onGetDevicesCount(data) {

    let devices = data;

    this.countDevices = (devices && devices[this._id]) ? devices[this._id].length : 0;

  }
  private onGetUsersCount(data) {

    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === this._id || this.showArchivedCompanies && isArchived && user.company.id === this._id;
    }).length;
  }

  getRecentInvoiceList() {
    let getInvoice = this.companiesService.getRecentInvoice().subscribe((data: any) => {
      data.forEach(element => {
        let obj = element;
        obj.dateName = moment(new Date(obj.date)).format('DD MMM YYYY');
        this.recentInvoiceList.push(obj);
      });
    });
    this.sub.add(getInvoice);
  }

  getContractsList() {
    let getInvoice = this.companiesService.getContractsList(this._id).subscribe((data: any) => {
      data.forEach(element => {
        let obj = element;
        obj.serviceAgreement.startDateName = moment(new Date(obj.serviceAgreement.startDate)).format('DD MMM YYYY');
        obj.serviceAgreement.endDateName = moment(new Date(obj.serviceAgreement.endDate)).format('DD MMM YYYY');
        this.contractsList.push(obj);
      });
    });
    this.sub.add(getInvoice);
  }

  getInvoiceRevenue(month) {
    let obj = {
      startDate: moment(new Date()).subtract(month, 'months').format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      id: this._id
    };
    let getRevenue = this.companiesService.getInvoiceRevenue(obj).subscribe((data: any) => {
      this.totalRevenue = data.collectedSum + data.invoicedSum + data.outstandingSum;
      this.invoicedSum = data.invoicedSum;
      this.collectedSum = data.collectedSum;
      this.outstandingSum = data.outstandingSum;
      this.month = month;
      this.data = [ 
        {
          "label" : "Invoiced Sum" ,
          "value" : data.invoicedSum
        } ,
        {
          "label" : "Collected Sum" ,
          "value" : data.collectedSum
        } ,
        {
          "label" : "Outstanding Sum" ,
          "value" : data.outstandingSum
        }
    ]
    });
    this.sub.add(getRevenue);
  }

  getTicketGraph(frequency: string) {
    let getTicket = this.companiesService.getTicketGraph(this._id, frequency.toUpperCase()).subscribe((data: any) => {
      this.ticketFrequency = frequency;
      let avgTime = [];
      let ticketCount = [];
      let resTime = [];
      data.forEach(element => {
        avgTime.push([new Date(element.date), element.averageTime]);
        ticketCount.push([new Date(element.date), element.countOfNewTickets]);
        resTime.push([new Date(element.date), element.responseTime]);
      });
      this.lineData = [
        {
            key: "Average Time",
            values: avgTime
        },
        {
            key: "New Tickets Count",
            values: ticketCount
        },
  
  
        {
            key: "Response Time",
            values: resTime
        }
      ];
    });
    this.sub.add(getTicket);
  }

  deleteTag(index: number) {
    this.tags.splice(index, 1);
    let removeTag = this.companiesService.removeTag(this._id, this.tags).subscribe((data: any) => {
      
    });
    this.sub.add(removeTag);
  }

  edit() {
    let getCompany = this.companiesService.getCompany(this._id).subscribe((data: CompanyProfile) => {

      this.companiesStateService.setEditCompany(data);
    })
    this.sub.add(getCompany);

  }

  timeFormatter(time) {
    if (time && time > 0) {
      var seconds = time > 43200 ? time - 43200 : time;
      var hours = Math.floor(seconds / 3600);
      var hoursToReturn = hours.toString().length > 1 ? hours : '0' + hours;
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var minutesToreturn = minutes.toString().length > 1 ? minutes : '0' + minutes;
      return hours  + ((minutes) ? (minutes / 60) : 0);
    } else {
      return 0;
    }
  }

  getTimeFormat(time) {
    if (time && time > 0) {
      var timeInHour = time / 3600;
     // var timeInHour = time / 60;
      if (timeInHour <= 12) {
        return 'AM';
      } else {
        return 'PM';
      }
    } else {
      return 'AM';
    }
  }

  saveHours() {
    this.workingDays;
    debugger;
  }

}
