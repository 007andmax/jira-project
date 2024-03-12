import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WORK_HOURS } from 'src/app/const/time';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-company-profile-operational-hours',
  templateUrl: './company-profile-operational-hours.component.html',
  styleUrls: ['./company-profile-operational-hours.component.scss']
})
export class CompanyProfileOperationalHoursComponent implements OnInit {
  cProfile = {
    address: [],
    logo: {},
    name: '',
    timeSettings: { workingDays: [], outliersSeconds: 0 },
    supportMailBox: ''
  };
  weekDays = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];
  workHours = WORK_HOURS;
  defaultWorkingDay = {
    dayOfWeek: 'MONDAY',
    startTime: 28800,
    endTime: 61200,
    isSelected: false
  };
  constructor(private companiesStateService: CompaniesStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private companyProfileService: CompanyProfileService,) { }

  ngOnInit() {
    this.cProfile = {
      address: [],
      logo: {},
      name: '',
      timeSettings: { workingDays: [], outliersSeconds: 0 },
      supportMailBox: ''
    };
    this.getCompanyProfile(this.companiesStateService.getCompanyProfile());
  }
  /**
    * display from time
    * @param from
    */
  fromTime_convert(from) {
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
    return this.workHours.find(item => item.value == value);
  }
  /**
 * start time changed based on params
 * @param workingday
 * @param startTime
 */
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
    const itemIndex = this.cProfile.timeSettings.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.cProfile.timeSettings.workingDays[itemIndex].startTime =
      hours * 3600 + minutes * 60;
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
    return this.workHours.find(item => item.value == value);
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
    const itemIndex = this.cProfile.timeSettings.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.cProfile.timeSettings.workingDays[itemIndex].endTime =
      hours * 3600 + minutes * 60;
  }
  /**
     * get company profile
     */
  getCompanyProfile(res) {
    this.cProfile.timeSettings = res.responseTimeSettings;
    // this.companyTimeZoneState.onEditMode(this.cProfile.address[0].timeZone);
    if (res.responseTimeSettings) {
      const workingDays = res.responseTimeSettings.workingDays;
      for (let i = 0; i < this.weekDays.length; i++) {
        const day = workingDays[i],
          name = this.weekDays[i];
        if (!day || day.dayOfWeek !== name) {
          this.defaultWorkingDay.dayOfWeek = name;
          workingDays.splice(
            i,
            0,
            Object.assign({}, this.defaultWorkingDay)
          );
        } else {
          day.isSelected = true;
        }
      }
    }
  }
  onWorkSubmit() {
    if (
      this.cProfile &&
      this.cProfile.timeSettings &&
      this.cProfile.timeSettings.workingDays
    ) {
      const selectedWorkingHours = this.cProfile.timeSettings.workingDays.filter(
        f => f.isSelected
      );
      const workingTime = {
        outliersSeconds: 21600,
        workingDays: selectedWorkingHours
      };
      const data = {
        companyWorkingTimeDto: {
          workingDays: selectedWorkingHours
        }
      };
      this.companyProfileService.workingTime(data).subscribe(
        res => {
        },
        error => {
          this.toastrService.error('Bad Request');
          this.appStateService.changeDetectorRef();
        }
      );
    }
  }
}
