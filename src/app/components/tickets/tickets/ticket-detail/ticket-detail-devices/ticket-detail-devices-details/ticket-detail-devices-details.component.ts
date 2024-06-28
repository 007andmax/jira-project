import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ticket-detail-devices-details',
  templateUrl: './ticket-detail-devices-details.component.html',
  styleUrls: ['./ticket-detail-devices-details.component.scss']
})
export class TicketDetailDevicesDetailsComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  devices: Array<DeviceCompany> = [];
  devicesReq: Array<DeviceCompany> = [];
  isSearch: boolean = false;
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter<any>();
  constructor(public ticketStateService: TicketStateService,
    private elRef: ElementRef,) { }

  ngOnInit() {
    this.devices = this.ticketStateService.getDevices();
    this.devicesReq = this.ticketStateService.getDevices();
    let onGetDevices = this.ticketStateService.onGetDevices.subscribe(data => {
      this.devices = data;
      this.devicesReq = data;
    })
    this.sub.add(onGetDevices);
  }
  clearSearch() {
    this.devices = JSON.parse(JSON.stringify(this.devicesReq)).map(item => new DeviceCompany(item, this.ticketProfile.company.id));
    this.elRef.nativeElement.querySelector("#search-devices").value = '';
    this.isSearch = false;
  }
  search(event) {
    if (event.target.value.length > 0) {
      this.devices = this.devicesReq.filter(item => item.getLabelForEdit().toLowerCase().includes(event.target.value.toLowerCase()));
      this.isSearch = true;
    } else {
      this.devices = JSON.parse(JSON.stringify(this.devicesReq)).map(item => new DeviceCompany(item, this.ticketProfile.company.id));
      this.isSearch = false;
    }
  }
  public trackById(index, item) {
    return item.id;
  }
  close() {
    this.onClose.emit(null);
  }
}
