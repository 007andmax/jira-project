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
  public companyDetail: CompanyProfile;
  constructor(private modalService: NgbModal,
    private companiesService: CompaniesService,
    private devicesState: DevicesSateService,
    private usersStateService: UsersStateService,
    private route: ActivatedRoute) {}
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
    this.route.params
    .subscribe(params => {
      this._id = params['id'];
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
    });
    
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
        y: function(d){ return d[1]/100; },
        average: function(d) { return d.mean/100; },

        duration: 300,
        useInteractiveGuideline: true,
        clipVoronoi: true,

        xAxis: {
            axisLabel: 'X Axis',
            tickFormat: function(d) {
                return d3.time.format('%m/%d/%y')(new Date(d))
            },
            showMaxMin: false,
            staggerLabels: true
        },

        yAxis: {
            axisLabel: 'Y Axis',
            tickFormat: function(d){
                return d3.format(',.1%')(d);
            },
            axisLabelDistance: 20
        }
      }
    }
    this.data = [];
    this.lineData = [
      {
          key: "Long",
          values: [ [ 1083297600000 , -2.974623048543] , 
          [ 1085976000000 , -1.7740300785979] , 
          [ 1088568000000 , 4.4681318138177] , 
          [ 1091246400000 , 7.0242541001353] , 
          [ 1093924800000 , 7.5709603667586] , 
          [ 1096516800000 , 20.612245065736]]
          ,
          mean: 250
      },
      {
          key: "Short",
          values: [ [ 1083297600000 , -0.77078283705125] , 
          [ 1085976000000 , -1.8356366650335] , 
          [ 1088568000000 , -5.3121322073127] , 
          [ 1091246400000 , -4.9320975829662] , 
          [ 1093924800000 , -3.9835408823225] , 
          [ 1096516800000 , -6.8694685316805]]
          ,
          mean: -60
      },


      {
          key: "Gross",
          mean: 125,
          values: [ [ 1083297600000 , -3.7454058855943] , 
          [ 1085976000000 , -3.6096667436314] , 
          [ 1088568000000 , -0.8440003934950] , 
          [ 1091246400000 , 2.0921565171691] , 
          [ 1093924800000 , 3.5874194844361] , 
          [ 1096516800000 , 13.742776534056] ]
      }
  ];
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
    let getCompany = this.companiesService.getCompany('07ed6152-997c-4389-81f9-a261e262e307').subscribe((data: CompanyProfile) => {
      this.companyDetail = data;
      this.name = this.companyDetail.name == undefined ? '' : this.companyDetail.name;
      this.addresses = this.companyDetail.addresses.length > 0 ? this.companyDetail.addresses[0].address : '';
      this.phoneNumber = this.companyDetail.addresses.length > 0 && this.companyDetail.addresses[0].phoneNumbers.length !== 0 ? this.companyDetail.addresses[0].phoneNumbers[0].number : '';
      this.totalTickets = this.companyDetail['companyTicketStatistic'].totalTickets;
      this.averageResponseTime = this.companyDetail['companyTicketStatistic'].averageResponseTime;
      let day = moment(new Date()).format('dddd');
      let workingDays = [];
      workingDays = this.companyDetail.workingDays;
      if (workingDays.length !== 0) {
        let arr = workingDays.filter(val => val.dayOfWeek.toLowerCase() === day.toLowerCase)
        if (arr.length !== 0 && arr[0].startTime !== 0 && arr[0].endTime !== 0) {
          this.companyOpen = 'Opens';
        } else {
          this.companyOpen = 'Close';
        }
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

    this.countDevices = (devices && devices['07ed6152-997c-4389-81f9-a261e262e307']) ? devices['07ed6152-997c-4389-81f9-a261e262e307'].length : 0;

  }
  private onGetUsersCount(data) {

    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === '07ed6152-997c-4389-81f9-a261e262e307' || this.showArchivedCompanies && isArchived && user.company.id === '07ed6152-997c-4389-81f9-a261e262e307';
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
    let getInvoice = this.companiesService.getContractsList('07ed6152-997c-4389-81f9-a261e262e307').subscribe((data: any) => {
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
      id: '07ed6152-997c-4389-81f9-a261e262e307'
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
    let getTicket = this.companiesService.getTicketGraph('07ed6152-997c-4389-81f9-a261e262e307', frequency.toUpperCase()).subscribe((data: any) => {
      this.ticketFrequency = frequency;
      debugger;
    });
    this.sub.add(getTicket);
  }

}
