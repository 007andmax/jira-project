import { Injectable, EventEmitter } from '@angular/core';
import { TimeZone } from '../class/time-zone';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyTimeZoneStateService {

  editMode: EventEmitter<any> = new EventEmitter();
  onTimeZone: EventEmitter<any> = new EventEmitter();
  public list: Array<TimeZone> = [];
  constructor(private companyProfileService: CompanyProfileService) { }

  public onGetTimeZone() {
    this.companyProfileService.getGroupedLocales().subscribe((data: any) => {
      this.list = data.map(item => new TimeZone(item));
      this.onTimeZone.emit(data);
    })
  }
  public setTimeZone(data) {
    this.list = data;
    this.onTimeZone.emit(data);
  }
  public getTimeZone() {
    return this.list;
  }
  public getOnEditMode() {
    return this.editMode;
  }
  public onEditMode(data) {
    this.editMode.emit(data);
  }
}
