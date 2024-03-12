import { Injectable, EventEmitter } from '@angular/core';
import { TimeZone } from '../class/time-zone';
import { TimeZoneService } from './time-zone.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyTimeZoneStateService {

  editMode: EventEmitter<any> = new EventEmitter();
  onTimeZone: EventEmitter<any> = new EventEmitter();
  public list: Array<TimeZone> = [];
  constructor(private timeZoneService: TimeZoneService) { }

  public onGetTimeZone() {
    this.timeZoneService.getTimeZones().subscribe((data: any) => {
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
