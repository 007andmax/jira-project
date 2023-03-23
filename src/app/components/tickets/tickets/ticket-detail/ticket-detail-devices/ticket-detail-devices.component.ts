import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';

@Component({
  selector: 'ticket-detail-devices',
  templateUrl: './ticket-detail-devices.component.html',
  styleUrls: ['./ticket-detail-devices.component.scss']
})
export class TicketDetailDevicesComponent implements OnInit {
  @Output() onShowMore = new EventEmitter<any>();
  toggleContainer: boolean = true;
  devices: Array<DeviceCompany> = [];
  constructor(public ticketStateService: TicketStateService,) { }

  ngOnInit() {
    this.devices = this.ticketStateService.getDevices();
    this.ticketStateService.onGetDevices.subscribe(data => {
      this.devices = data;
    })
  }
  public trackByIndex(index, item) {
    return index;
  }
  showMore() {
    this.onShowMore.emit(null);
  }


}
