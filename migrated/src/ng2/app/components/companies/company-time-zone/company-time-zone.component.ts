import { Component, OnInit } from '@angular/core';
import { TimeZoneService } from './services/time-zone.service';

@Component({
  selector: 'app-company-time-zone',
  templateUrl: './company-time-zone.component.html',
  styleUrls: ['./company-time-zone.component.scss']
})
export class CompanyTimeZoneComponent implements OnInit {

  constructor(private timeZoneService: TimeZoneService) { }

  ngOnInit() {
    this.timeZoneService.getTimeZones().subscribe(data => {
      console.log('timeZoneService',data);
    })
  }



}
