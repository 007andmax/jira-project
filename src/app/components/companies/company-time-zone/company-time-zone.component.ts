import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, OnDestroy, Input } from '@angular/core';
import { TimeZoneService } from './services/time-zone.service';
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
  constructor(private timeZoneService: TimeZoneService, private elRef: ElementRef,
    private companyTimeZoneState: CompanyTimeZoneStateService) { }

  ngOnInit() {
    let getTimeZones = this.timeZoneService.getTimeZones().subscribe((data: any) => {
      this.list = data.map(item => new TimeZone(item));
      if (this.selectedItem) {
        let find = this.list.find(item => item.second === this.selectedItem.second);
        this.selectedItem = find;
      }
    })
    this.sub.add(getTimeZones);
    this.onEditMode();
  }

  private onEditMode() {
    let getEditMode = this.companyTimeZoneState.getOnEditMode().subscribe((data) => {
      if (data) {
        let find = this.list.find(item => item.second === data.name);
        this.selectedItem = find;
        //   this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = find.first;
      } else {
        this.selectedItem = null;
        //this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = '';
      }
    })
    this.sub.add(getEditMode);
  }
  /**
    * set and emit product item
    */
  public setOffset(data: TimeZone) {
    this.selectedItem = data;
    // this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = data.first;
    this.selectedOffsetItem.next(data);
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
