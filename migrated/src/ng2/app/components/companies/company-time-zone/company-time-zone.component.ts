import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { TimeZoneService } from './services/time-zone.service';
import { TimeZone } from './class/time-zone';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TimeZoneOffset } from './class/time-zone-offset';

@Component({
  selector: 'app-company-time-zone',
  templateUrl: './company-time-zone.component.html',
  styleUrls: ['./company-time-zone.component.scss']
})
export class CompanyTimeZoneComponent implements OnInit {
  @ViewChild('zones_dropDown') zones_dropDown: NgbDropdown;
  @Output() selectedOffsetItem = new EventEmitter<any>();
  public isFormValid = false;
  public list: Array<TimeZone> = [];
  constructor(private timeZoneService: TimeZoneService, private elRef: ElementRef) { }
 
  ngOnInit() {
    this.timeZoneService.getTimeZones().subscribe(data => {
      console.log('timeZoneService', data);
      for (var prop in data) {
        this.list.push(new TimeZone(prop, data[prop]));
         
      }
      console.log('list', this.list);
    })
  }

  /**
    * set and emit product item
    */
  public setOffset(offset:TimeZoneOffset) {

    this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = offset.city;
    this.zones_dropDown.close();
    this.selectedOffsetItem.next(offset);
  }

  public trackByIndex(index, item) {
    return index;
  }

}
