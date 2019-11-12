import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { TimeZoneService } from './services/time-zone.service';
import { TimeZone } from './class/time-zone';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TimeZoneOffset } from './class/time-zone-offset';
import { CompanyTimeZoneStateService } from './services/company-time-zone-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-time-zone',
  templateUrl: './company-time-zone.component.html',
  styleUrls: ['./company-time-zone.component.scss']
})
export class CompanyTimeZoneComponent implements OnInit, OnDestroy {

  @ViewChild('zones_dropDown') zones_dropDown: NgbDropdown;
  @Output() selectedOffsetItem = new EventEmitter<any>();
  public isFormValid = false;
  public list: Array<TimeZone> = [];
  sub: Subscription = new Subscription();
  constructor(private timeZoneService: TimeZoneService, private elRef: ElementRef,
    private companyTimeZoneState: CompanyTimeZoneStateService) { }

  ngOnInit() {
    this.timeZoneService.getTimeZones().subscribe(data => {

      for (var prop in data) {
        this.list.push(new TimeZone(prop, data[prop]));

      }
      console.log('list', this.list);
    })
    this.onEditMode();
  }

  private onEditMode() {
    let getEditMode = this.companyTimeZoneState.getOnEditMode().subscribe((data) => {
      
      if (data.name.indexOf('/') > -1) {
        let city = data.name.substring(data.name.indexOf('/') + 1,data.name.length);
      
        this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = city;
      } else {
        this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = data.name;
      }
    })
    this.sub.add(getEditMode);
  }

  /**
    * set and emit product item
    */
  public setOffset(offset: TimeZoneOffset) {

    this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = offset.city;
    this.zones_dropDown.close();
    this.selectedOffsetItem.next(offset);
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
  this.sub.unsubscribe();
  }

}
