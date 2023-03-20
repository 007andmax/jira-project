import { Component, Input, OnInit } from '@angular/core';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';

@Component({
  selector: 'ticket-detail-devices-item',
  templateUrl: './ticket-detail-devices-item.component.html',
  styleUrls: ['./ticket-detail-devices-item.component.scss']
})
export class TicketDetailDevicesItemComponent implements OnInit {
  @Input() device: DeviceCompany;
  constructor() { }

  ngOnInit() {
  }
  returnTimeFormat(time) {
    let hours = 0;
    let minutes = 0;
    hours = Math.floor(time / 3600000);
    minutes = Math.floor((time - (hours * 3600000)) / 60000);
    return {
      hours: hours,
      minutes: minutes,
    }
  }
  returnTimeFormatUpTime(time) {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    days = Math.floor(time / 86400000);
    hours = Math.floor((time - (days * 86400000)) / 3600000);
    minutes = Math.floor((time - (days * 86400000) - (hours * 3600000)) / 60000);
    return {
      days: days,
      hours: hours,
      minutes: minutes,
    }
  }
}
