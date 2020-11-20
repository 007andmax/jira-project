import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices-remote-access/company-devices-remote-access.component';
import * as moment from "moment";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';

@Component({
  selector: 'app-company-devices-item',
  templateUrl: './company-devices-item.component.html',
  styleUrls: ['./company-devices-item.component.scss']
})
export class CompanyDevicesItemComponent implements OnInit {
  @Input() device: DeviceCompany;

  constructor(private modalService: NgbModal, private devicesService: DevicesService,) { }

  ngOnInit() {
  }
  openModalRemoteAccess() {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'quote-send-modal' });
    /*let data = JSON.parse(JSON.stringify(quote.getDataForCreate(true)));
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.action = QUOTE_MODAL_ACTION_ADD;*/
    console.log(this.returnTimeFormatForPage(this.device.timing.offline));
  }

  setIcon(iconName) {
    this.devicesService.setIcon(this.device.getDataForEditIcon(iconName)).subscribe(data => {

    })
  }
  returnTimeFormatForPage(time) {
    return {
      days: (time == 0) ? 0 : moment(time).date(),
      hours: (time == 0) ? 0 : moment(time).hour(),
      minutes: (time == 0) ? 0 : moment(time).minute(),
      seconds: (time == 0) ? 0 : moment(time).second()
    }
  }
}
