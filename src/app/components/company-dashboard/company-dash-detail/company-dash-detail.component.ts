import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CompanyProfile } from '../../companies/class/company-profile';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompanyPrimaryContact } from '../../companies/class/company-primary-contact';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DownloadAgentStateService } from 'src/app/states/download-agent/download-agent-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadAgentComponent } from '../../companies/download-agent/download-agent.component';
import { CompanyTagsStateService } from '../../companies/company-tags/states/company-tags-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TicketProfileFormService } from '../../../../app/components/tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { CompanyServiceType } from '../../companies/class/company-service-type';
import { CompanyDetaill } from './company-detailing';
import { ActivatedRoute } from '@angular/router';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-company-dash-detail',
  templateUrl: './company-dash-detail.component.html',
  styleUrls: ['./company-dash-detail.component.scss']
})
export class CompanyDashDetailComponent implements OnInit {

  public companyDetail: CompanyProfile = new CompanyProfile();
  companyDetailing: CompanyDetaill = {
    name: '',
    addresses: [],
    addresses_name: '',
    phoneNumber: '',
    totalTickets: 0,
    averageResponseTime: '0',
    serviceType: '',
    domain: '',
    clientIndustry: "",
    tags: [],
    mapSrc: "",
    primaryContact: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      avatar: ''
    },
    reputation: 0,
    clientType: '',
    description: ''
  };
  _id: string = '';
  mapSrc: string = '';
  companyOpen: string = 'Close';
  workingDays = [];
  closingSoon: boolean = false;
  tagSaved: boolean = false;
  sub: Subscription = new Subscription();
  tags = [];
  closeResult: string = '';
  modalReference: any;
  @Output() totalTicketsChanged: EventEmitter<number> = new EventEmitter();
  @Output() companyNameChanged: EventEmitter<string> = new EventEmitter();
  @Output() companyChanged: EventEmitter<any> = new EventEmitter();
  @Output() averageResponseTimeChanged: EventEmitter<string> = new EventEmitter();
  currentService: TicketProfileFormService = new TicketProfileFormService();
  serviceTypesMap: CompanyServiceType = {
    HOURLY: 'Hourly',
    BLOCK_TIME: 'Block time',
    SEMI_MANAGED: 'Semi managed',
    FULLY_MANAGED: 'Fully managed'
  }
  workingHoursList: WorkingHours[] = [
    {
      name: '12:00 AM',
      value: '00:00'
    },
    {
      name: '12:30 AM',
      value: '00:30'
    },
    {
      name: '1:00 AM',
      value: '01:00'
    },
    {
      name: '1:30 AM',
      value: '01:30'
    },
    {
      name: '2:00 AM',
      value: '02:00'
    },
    {
      name: '2:30 AM',
      value: '02:30'
    },
    {
      name: '3:00 AM',
      value: '03:00'
    },
    {
      name: '3:30 AM',
      value: '03:30'
    },
    {
      name: '4:00 AM',
      value: '04:00'
    },
    {
      name: '4:30 AM',
      value: '04:30'
    },
    {
      name: '5:00 AM',
      value: '05:00'
    },
    {
      name: '5:30 AM',
      value: '05:30'
    },
    {
      name: '6:00 AM',
      value: '06:00'
    },
    {
      name: '6:30 AM',
      value: '06:30'
    },
    {
      name: '7:00 AM',
      value: '07:00'
    },
    {
      name: '7:30 AM',
      value: '07:30'
    },
    {
      name: '8:00 AM',
      value: '08:00'
    },
    {
      name: '8:30 AM',
      value: '08:30'
    },
    {
      name: '9:00 AM',
      value: '09:00'
    },
    {
      name: '9:30 AM',
      value: '09:30'
    },
    {
      name: '10:00 AM',
      value: '10:00'
    },
    {
      name: '10:30 AM',
      value: '10:30'
    },
    {
      name: '11:00 AM',
      value: '11:00'
    },
    {
      name: '11:30 AM',
      value: '11:30'
    },
    {
      name: '12:00 PM',
      value: '12:00'
    },
    {
      name: '12:30 PM',
      value: '12:30'
    },
    {
      name: '13:00 PM',
      value: '13:00'
    },
    {
      name: '13:30 PM',
      value: '13:30'
    },
    {
      name: '14:00 PM',
      value: '14:00'
    },
    {
      name: '14:30 PM',
      value: '14:30'
    },
    {
      name: '15:00 PM',
      value: '15:00'
    },
    {
      name: '15:30 PM',
      value: '15:30'
    },
    {
      name: '16:00 PM',
      value: '16:00'
    },
    {
      name: '16:30 PM',
      value: '16:30'
    },
    {
      name: '17:00 PM',
      value: '17:00'
    },
    {
      name: '17:30 PM',
      value: '17:30'
    },
    {
      name: '18:00 PM',
      value: '18:00'
    },
    {
      name: '18:30 PM',
      value: '18:30'
    },
    {
      name: '19:00 PM',
      value: '19:00'
    },
    {
      name: '19:30 PM',
      value: '19:30'
    },
    {
      name: '20:00 PM',
      value: '20:00'
    },
    {
      name: '20:30 PM',
      value: '20:30'
    },
    {
      name: '21:00 PM',
      value: '21:00'
    },
    {
      name: '21:30 PM',
      value: '21:30'
    },
    {
      name: '22:00 PM',
      value: '22:00'
    },
    {
      name: '22:30 PM',
      value: '22:30'
    },
    {
      name: '23:00 PM',
      value: '23:00'
    },
    {
      name: '23:30 PM',
      value: '23:30'
    }
  ];
  selectedRating = 0;
  unSelectedRating = 0;
  ratingSaved: boolean = false;

  public constructor(private companiesService: CompaniesService,
    private toaster: ToastrService,
    private downloadAgentStateService: DownloadAgentStateService,
    private modalService: NgbModal,
    private tagsState: CompanyTagsStateService,
    private companiesStateService: CompaniesStateService,
    private sanitizer: DomSanitizer,
    public activateRoute: ActivatedRoute,
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      this.getCompanyDetails();
    });
    this.sub.add(subscription);
    this.currentService = new TicketProfileFormService();
  }

  public onChangeStartTimePicker(data) {
    this.currentService.setDurationStart(data);
  }

  public onChangeEndTimePicker(data) {
    this.currentService.setDurationEnd(data);
  }

  getCompanyDetails() {
    let getCompany = this.companiesService.getCompany(this._id).subscribe((data: CompanyProfile) => {
      this.companyDetail.onEditMode(data);
      this.companyDetailing = this.companyDetail.getDataForDashboard();
      if (this.companyDetailing.reputation === undefined || this.companyDetailing.reputation === null) {
        this.unSelectedRating = 5
      } else {
        this.selectedRating = this.companyDetailing.reputation;
        this.unSelectedRating = 5 - this.selectedRating;
      }
      // this.companyDetail = data;
      this.companyChanged.emit(this.companyDetail);
      this.companyNameChanged.emit(this.companyDetailing.name);
      this.totalTicketsChanged.emit(this.companyDetailing.totalTickets);
      this.averageResponseTimeChanged.emit(this.companyDetailing.averageResponseTime);
      this.tags = this.companyDetailing.tags;
      let day = moment(new Date()).format('dddd');
      this.workingDays = data.workingDays;
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
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
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
    return name === null || name === '' ? '' : name[0] + name[1];
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }


  timeFormatter(time) {
    if (time && time > 0) {
      var seconds = time > 43200 ? time - 43200 : time;
      var hours = Math.floor(seconds / 3600);
      var hoursToReturn = hours.toString().length > 1 ? hours : '0' + hours;
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var minutesToreturn = minutes.toString().length > 1 ? minutes : '0' + minutes;
      return hoursToReturn + ':' + minutesToreturn;
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
      return hours + ((minutes) ? (minutes / 60) : 0);
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
      } else if (this.ratingSaved == true) {
        msg = 'Rating saved successfully';
      }
      this.toaster.success(msg, null, {
        timeOut: 5000
      });
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
      this.tagSaved = false;
      this.ratingSaved = false;
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

  open(content: any) {
    this.tagsState.setTagsFromtEdit(this.tags);
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'cmp-comapny-modal edit-hours' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
  openTag(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'cmp-comapny-modal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
  openMap(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'cmp-comapny-modal map' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
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


  mapUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.companyDetailing.mapSrc);
  }

  startTimeChange(workingday: any, startTime: any) {
    const splitTime = startTime.split(':');
    // if (!Number(splitTime[0])) {
    //   return;
    // }
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
  public back() {
    this.leftPanelStateService.goToState('new-companies');
  }
  changeRating(index, type) {
    let rating = 0;
    if (type === 'selected') {
      rating = index + 1;
    } else {
      rating = this.selectedRating + (index + 1)
    }
    this.companyDetail.reputation = rating;
    this.ratingSaved = true;
    if (this.companyDetail.reputation === undefined || this.companyDetail.reputation === null) {
      this.unSelectedRating = 5
    } else {
      this.selectedRating = this.companyDetail.reputation;
      this.unSelectedRating = 5 - this.selectedRating;
    }
    this.saveCompany();
  }

  filterTime(time) {
    let data = this.workingHoursList.filter(val => val.value == time);
    return data[0].name;
  }
}

export interface WorkingHours {
  name: string;
  value: string;
}
