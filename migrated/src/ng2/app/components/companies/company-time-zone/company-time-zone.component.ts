import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { TimeZoneService } from './services/time-zone.service';
import { TimeZone } from './class/time-zone';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-company-time-zone',
  templateUrl: './company-time-zone.component.html',
  styleUrls: ['./company-time-zone.component.scss']
})
export class CompanyTimeZoneComponent implements OnInit {
  @ViewChild('products') products_dropDown: NgbDropdown;
  @Output() selectedProductItem = new EventEmitter<any>();
  public isFormValid = false;
  constructor(private timeZoneService: TimeZoneService, private elRef: ElementRef) { }
  list: Array<TimeZone> = [];
  ngOnInit() {
    this.timeZoneService.getTimeZones().subscribe(data => {
      console.log('timeZoneService', data);
      for (var prop in data) {
        this.list.push(new TimeZone(prop, data[prop]));
        //  console.log("obj." + prop + " = " + data[prop]);
        //   console.log('data[prop]',data[prop]);
      }
      console.log('list', this.list);
    })
  }

  /**
    * set and emit product item
    */
  public setСity(city) {

    this.elRef.nativeElement.querySelector('#dropdownTimeZone').value = city;
    this.products_dropDown.close();
    this.selectedProductItem.next(city);
  }

}
