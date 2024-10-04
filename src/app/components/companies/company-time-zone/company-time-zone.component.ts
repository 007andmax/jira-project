import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { TimeZone } from './class/time-zone';
import { CompanyTimeZoneStateService } from './services/company-time-zone-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-time-zone',
  templateUrl: './company-time-zone.component.html',
  styleUrls: ['./company-time-zone.component.scss']
})
export class CompanyTimeZoneComponent implements OnInit, OnDestroy {
  @Output() selectedOffsetItem = new EventEmitter<any>();
  public isFormValid = false;
  public list: Array<TimeZone> = [];
  @Input() selectedItem: TimeZone = null;
  sub: Subscription = new Subscription();
  constructor(
    private companyTimeZoneState: CompanyTimeZoneStateService) { }

  ngOnInit() {
    if (this.companyTimeZoneState.getTimeZone().length > 0) this.list = this.companyTimeZoneState.getTimeZone();
    if (this.companyTimeZoneState.getTimeZone().length == 0) this.companyTimeZoneState.onGetTimeZone();
    let onTimeZone = this.companyTimeZoneState.onTimeZone.subscribe(data => {
      this.list = data.map(item => new TimeZone(item));
      if (this.selectedItem) {
        let find = this.list.find(item => item.second === this.selectedItem.second);
        this.selectedItem = find;
      }
    })
    this.sub.add(onTimeZone);
    this.onEditMode();
  }

  private onEditMode() {
    let getEditMode = this.companyTimeZoneState.getOnEditMode().subscribe((data) => {
      if (data) {
        let find = this.list.find(item => item.second === data.name);
        this.selectedItem = find;
      } else {
        this.selectedItem = null;
      }
    })
    this.sub.add(getEditMode);
  }
  /**
    * set and emit product item
    */
  public setOffset(data: TimeZone) {
    this.selectedItem = data;
    this.selectedOffsetItem.next(data);
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
