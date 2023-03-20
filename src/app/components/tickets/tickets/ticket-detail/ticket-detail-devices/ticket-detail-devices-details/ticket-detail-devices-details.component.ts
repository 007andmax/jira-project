import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';

@Component({
  selector: 'ticket-detail-devices-details',
  templateUrl: './ticket-detail-devices-details.component.html',
  styleUrls: ['./ticket-detail-devices-details.component.scss']
})
export class TicketDetailDevicesDetailsComponent implements OnInit {
  devices: Array<DeviceCompany> = [];
  @Output() onClose = new EventEmitter<any>();
  constructor(public ticketStateService: TicketStateService,) { }

  ngOnInit() {
    this.devices = this.ticketStateService.getDevices();
    this.ticketStateService.onGetDevices.subscribe(data => {
      this.devices = data;
    })
  }
  close() {
    this.onClose.emit(null);
  }
}
