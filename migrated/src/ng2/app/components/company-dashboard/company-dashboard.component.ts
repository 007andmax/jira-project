import { NgModule, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TicketProfileFormService } from '../../../../ng2/app/components/tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompanyProfile } from '../companies/class/company-profile';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { DevicesSateService } from '../../states/devices/devices-sate.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { DownloadAgentStateService } from '../../states/download-agent/download-agent-state.service';
import { DownloadAgentComponent } from '../companies/download-agent/download-agent.component';
import { Company } from '../../interfaces/company/company';
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from 'ngx-toastr';
import { ServiceAgreement } from '../billing/contracts/class/service-agreement';
import { ContractsStateService } from '../../states/contracts/contracts-state.service';
import { CompanyTagsStateService } from '../companies/company-tags/states/company-tags-state.service';
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
  currentService: TicketProfileFormService = new TicketProfileFormService();
  chartOptions: any;
  lineChartOptions: any;
  data: any;
  lineData: any;
  chartColors = ["#0747a6", "#00ccff", '#cdecff'];
  lineChartColors = ["#0747a6", "#00ccff", '#2bc7c6', '#7C77CB'];
  _id:string = '';
  companyOpen:string = 'Close';
  company: Company;
  totalTickets:number = 0;
  averageResponseTime:string = '';
  public countUsers: number = 0;
  public countDevices: number = 0;
  showArchivedCompanies = false;
  recentInvoiceList = [];
  contractsList = [];
  sub: Subscription = new Subscription();
  totalRevenue:string = '';
  invoicedSum:number = 0;
  collectedSum:number = 0;
  outstandingSum:number = 0;
  addresses:string = '';
  phoneNumber:string = '';
  name:string = '';
  month:string = '12'
  ticketFrequency:string = 'Monthly';
  primaryContact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: ''
  };
  tags = [];
  statistics = [];
  statisticsCount = 0;
  mapSrc:string = '';
  serviceType:string = '';
  domain:string = '';
  tagSaved:boolean = false;
  serviceTypesMap = {
    HOURLY: 'Hourly',
    BLOCK_TIME: 'Block time',
    SEMI_MANAGED: 'Semi managed',
    FULLY_MANAGED: 'Fully managed'
  }
  contractType = {
    HOURLY: 'Custom Hourly',
    BLOCK_TIME: 'Block Time',
    SERVICE_CONTRACT: 'Service Contract',
  };
  closingSoon:boolean = false;
  workingDays = [];
  statisticsColor = ['0747a6', '00ccff', '052e6b', 'cdecff', '16A4FA', '7C77CB', '2BC7C6'];
  clientIndustry: string = '';
  modalReference: any;
  showContractPreview: boolean = false;
  public companyDetail: CompanyProfile;
  serviceAgreement: ServiceAgreement;
  constructor(private modalService: NgbModal,
    private companiesService: CompaniesService,
    private devicesState: DevicesSateService,
    private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService,
    private downloadAgentStateService: DownloadAgentStateService,
    private toaster: ToastrService,
    private sanitizer: DomSanitizer,
    public cd: ChangeDetectorRef,
    public contractsStateService: ContractsStateService,
    private tagsState: CompanyTagsStateService) {}
  closeResult = '';

  open(content: any) {
    this.tagsState.setTagsFromtEdit(this.tags);
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
  openTag(content: any) {
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
      let getOnPreview = this.contractsStateService.getOnPreview().subscribe(data => {
        this.serviceAgreement = data;
        this.showContractPreview = true;
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
      this.sub.add(getOnPreview);
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
      this.serviceType = (this.companyDetail.serviceType == undefined || this.companyDetail.serviceType == null) ? '' : this.companyDetail.serviceType;
      this.domain = (this.companyDetail.domain == undefined || this.companyDetail.domain == null) ? '' : this.companyDetail.domain;
      let type = typeof this.companyDetail.contacts[0].phoneNumbers[0];
      let typeIndustry = typeof this.companyDetail.clientIndustry;
      let name = '';
      if (typeIndustry === 'object' && this.companyDetail.clientIndustry !== null) {
        this.name = this.companyDetail.clientIndustry.name;
      }
      this.clientIndustry = typeIndustry === 'object' ? name : this.companyDetail.clientIndustry;
      this.primaryContact = {
        firstName: this.companyDetail.contacts[0].firstName,
        lastName: this.companyDetail.contacts[0].lastName,
        email: this.companyDetail.contacts[0].primaryEmail,
        phoneNumber: type === 'object' ? this.companyDetail.contacts[0].phoneNumbers[0].number : this.companyDetail.contacts[0].phoneNumbers[0],
        avatar: this.companyDetail.contacts[0].avatar
      }
      // this.mapSrc = `https://maps.google.com/maps?q=${this.companyDetail.addresses[0].locationLat},${this.companyDetail.addresses[0].locationLng}&z=15&amp;output=embed`;
      this.mapSrc = "https://maps.google.com/maps/embed/v1/place?key=AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s&q="+this.companyDetail.addresses[0].locationLat +","+this.companyDetail.addresses[0].locationLng+"";
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
          element.checked = false;
          let e1: any, s1: any;
          if (element.startTime !== 0 && element.endTime !== 0) {
            element.timing = `${this.timeFormatter(element.startTime)} ${this.getTimeFormat(element.startTime)} - ${this.timeFormatter(element.endTime)} ${this.getTimeFormat(element.endTime)}`
            s1 = this.timeFormatter(element.startTime) + ':00 ' + this.getTimeFormat(element.startTime)
            element.sTime = new Date('01/01/1990 ' + s1)
            e1 = this.timeFormatter(element.endTime) + ':00 ' + this.getTimeFormat(element.endTime)
            element.eTime = new Date('01/01/1990 ' + e1)
            element.checked = true
            let current = parseInt(moment(new Date()).format('hh'));
            if (day.toLowerCase() === element.dayOfWeek.toLowerCase() && this.getTimeFormat(element.startTime) == moment(new Date()).format('A') && this.timeFormat(element.endTime) - 1 == current) {
              this.closingSoon = true;
            }
          }
        });
      }
      
    })
    this.sub.add(getCompany);
  }

  public onChangeTags(tags) {
    this.companyDetail.tags = tags;
  }

  saveTags() {
    this.tagSaved = true;
    this.saveCompany();
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
      
      let statistics = [];
      data.forEach(element => {
        let obj = element;
        obj.serviceAgreement.startDateName = moment(new Date(obj.serviceAgreement.startDate)).format('DD MMM YYYY');
        obj.serviceAgreement.endDateName = moment(new Date(obj.serviceAgreement.endDate)).format('DD MMM YYYY');
        this.contractsList.push(obj);
        if (element.statistics !== null)
        statistics = statistics.concat(element.statistics);
      });
      statistics.forEach(element => {
        this.statisticsCount += Math.round(element.quantity);
      });
      statistics.forEach((element, index) => {
        this.statistics.push({
          itemId: element.itemId,
          itemName: element.itemName,
          quantity: Math.round(element.quantity),
          width: ((Math.round(element.quantity) / this.statisticsCount) * 100) + '%',
          color: '#' + this.statisticsColor[index],
          code: this.statisticsColor[index]
        })
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
      let totalRevenue = data.collectedSum + data.invoicedSum + data.outstandingSum;
      this.totalRevenue = totalRevenue.toFixed(2);
      if (totalRevenue > 100000) {
        this.totalRevenue = (totalRevenue / 100000).toFixed(2) + 'L'
      } else if (totalRevenue > 1000) {
        this.totalRevenue = (totalRevenue / 1000).toFixed(2) + 'k'
      }
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
      return hoursToReturn  + ':' + minutesToreturn;
    } else {
      return 0;
    }
  }

  timeFormat(time) {
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
    let data = [];
    this.workingDays.forEach(element => {
      data.push({
        dayOfWeek: element.dayOfWeek,
        startTime: element.checked === true ? element.startTime : 0,
        endTime: element.checked === true ? element.endTime : 0
      });
    });
    this.companyDetail.workingDays = data;
    this.workingDays.forEach((element, index) => {
      if (element.startTime !== 0 && element.endTime !== 0) {
        element.timing = `${this.timeFormatter(element.startTime)} ${this.getTimeFormat(element.startTime)} - ${this.timeFormatter(element.endTime)} ${this.getTimeFormat(element.endTime)}`
      }
    });
    this.saveCompany();
  }

  gotSecondFromTimeAndFormatObject(objectTime, objectTimeFormat) {
    if (objectTime && objectTimeFormat) {
      
      let hours, minutes, separateTime;

      if (typeof objectTime === 'string') {
        separateTime = objectTime.split(':');
        hours = parseInt(separateTime[0]);
        minutes = parseInt(separateTime[1]);
      } else {
     /*   hours = Math.floor(objectTime / 60);
        minutes = objectTime % 60;*/
        let timeInMinutes = objectTime * 60,
        hours = Math.floor(timeInMinutes / 60),
        minutes = Math.round(timeInMinutes - (hours * 60));
    
      }

      return (objectTimeFormat === 'AM' ? hours * 3600 + minutes * 60 : hours * 3600 + minutes * 60 + 12 * 3600);
    }
  }

  saveCompany() {
    let savecompany = this.companiesService.editWoringHours(this.companyDetail).subscribe((data: any) => {
      let msg = 'Working hours updated successfully';
      if (this.tagSaved == true) {
        msg = 'Tags saved successfully'; 
        this.tags = this.companyDetail.tags;
      }
      this.toaster.success(msg, null, {
        timeOut: 5000
      });
      this.tagSaved = false;
    });
    this.sub.add(savecompany);
  }

  public onChangeStartTime(data, i) {
    this.workingDays[i].sTime = data;
  }
  public onChangeEndTime(data, i) {
    this.workingDays[i].eTime = data;
  }

  resetTime(index: number) {
    this.workingDays[index].checked = !this.workingDays[index].checked;
    if (this.workingDays[index].checked === false) {
      this.workingDays[index].sTime = 0;
      this.workingDays[index].eTime = 0;
    }
  } 

  downloadAgent() {

    this.downloadAgentStateService.setCompnay(this.companyDetail);
    const modalRef = this.modalService.open(DownloadAgentComponent, { windowClass: 'download-modal' });

  }

  mapUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.mapSrc);
  }

  startTimeChange(workingday: any, startTime: any) {
    const splitTime = startTime.split(':');
    if (!Number(splitTime[0])) {
      return;
    }
    let hours = parseInt(splitTime[0]) || 0;
    let minutes =
      (!splitTime[1] || splitTime[1].length > 1
        ? parseInt(splitTime[1])
        : parseInt(splitTime[1] + '0')) || 0;

    if (minutes > 59) {
      minutes = 0;
    }

    if (hours > 23) {
      hours = 23;
    }
    const itemIndex = this.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.workingDays[itemIndex].startTime = hours * 3600 + minutes * 60;
  }

  endTimeChange(workingday: any, endTime: any) {
    const splitTime = endTime.split(':');
    if (!Number(splitTime[0])) {
      return;
    }
    let hours = parseInt(splitTime[0]) || 0;
    let minutes =
      (!splitTime[1] || splitTime[1].length > 1
        ? parseInt(splitTime[1])
        : parseInt(splitTime[1] + '0')) || 0;

    if (minutes > 59) {
      minutes = 0;
    }

    if (hours > 23) {
      hours = 23;
    }
    const itemIndex = this.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.workingDays[itemIndex].endTime =
      hours * 3600 + minutes * 60;
  }

  fromTime_convert(from) {
    const startWith = 'from ',
      splitWith = ' to ';
    const fromHours = Math.floor(from / 3600);
    const fromMinutes = Math.round(from / 60 - fromHours * 60);

    let fHours = '';
    if (fromHours < 10) {
      fHours = '0' + fromHours;
    }

    let fMinutes = '';
    if (fromMinutes < 10) {
      fMinutes = '0' + fromMinutes;
    }

    const h = fHours ? fHours : Number(fromHours) ? fromHours : 0;
    const m = fMinutes ? fMinutes : Number(fromMinutes) ? fromMinutes : 0;

    const value = h + ':' + m;

    return value;
  }

  /**
   * display to time
   * @param to
   */
  toTime_convert(to) {
    const toHours = Math.floor(to / 3600);
    const toMinutes = Math.round(to / 60 - toHours * 60);

    let tHours = '';
    if (toHours < 10) {
      tHours = '0' + toHours;
    }

    let tMinutes = '';
    if (toMinutes < 10) {
      tMinutes = '0' + toMinutes;
    }

    const h = tHours !== '' ? tHours : toHours;
    const m = tMinutes !== '' ? tMinutes : toMinutes;

    const value = h + ':' + m;
    return value;
  }

  openContractPreview() {
    this.showContractPreview = true;
  }

}
