import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { PasswordManagerLinkedComponent } from 'src/app/components/password-manager/password-manager-add-aside/password-manager-linked/password-manager-linked.component';
import { TicketProfile } from '../../class/ticket-profile';
import { Device } from 'src/app/components/company-devices/class/device';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';

@Component({
  selector: 'ticket-detail-linked-agents',
  templateUrl: './ticket-detail-linked-agents.component.html',
  styleUrls: ['./ticket-detail-linked-agents.component.scss']
})
export class TicketDetailLinkedAgentsComponent extends PasswordManagerLinkedComponent {
  devices: Array<DeviceCompany> = [];
  @Input() selectedCompanyId: string;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  selectedDevice;
  ngOnInit() {
    if (this.ticketProfile.agent) this.selectedDevice = JSON.parse(JSON.stringify(this.ticketProfile.agent));
    if (this.ticketStateService.getDevices().length > 0) this.getDevicesCompany(this.ticketStateService.getDevices());
    let onGetDevices = this.ticketStateService.onGetDevices.subscribe(data => {
      this.getDevicesCompany(this.ticketStateService.getDevices());
    })
    this.sub.add(onGetDevices);
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  getDevicesCompany(data) {
    this.devices = data.filter(item => !item.isCustom);
    this.preloader = false;
    if (this.selectedCompanyId) this.onSelectCompany(this.selectedCompanyId);
  }
  onSelectCompany(id) {
    this.usersList = [];
    this.devicesList = [];
    this.gadgets = [];
    this.selectedCompanyId = null;
    if (id) {
      this.selectedCompanyId = id;
      let devices = this.devices ? this.devices : [];
      devices.forEach(item => {
        this.devicesList.push(item);
        if (this.ticketProfile.agent && this.ticketProfile.agent.deviceId == item.deviceId) this.selectedDevice = item;
      })
      this.devicesList.sort((a, b) => (this.getLabelDevice(a).toLowerCase() > this.getLabelDevice(b).toLowerCase()) ?
        1 : ((this.getLabelDevice(b).toLowerCase() > this.getLabelDevice(a).toLowerCase()) ? -1 : 0));
    }
  }
  public onSearch(event) {
    this.devicesList = this.devices.filter(item => this.getLabelDevice(item).toLowerCase().includes(event.target.value.toLowerCase()))
      .sort((a, b) => (this.getLabelDevice(a).toLowerCase() > this.getLabelDevice(b).toLowerCase()) ?
        1 : ((this.getLabelDevice(b).toLowerCase() > this.getLabelDevice(a).toLowerCase()) ? -1 : 0));
    this.cd.detectChanges();
  }
  public selected(newItem) {
    if (this.selectedDevice && this.selectedDevice.id === newItem.id) {
      this.removeItem();
      return;
    }
    this.selectedDevice = newItem;
    this.changeLinkedAgent(newItem.deviceId);
  }
  removeItem() {
    this.changeLinkedAgent('');
    this.selectedDevice = null;
  }
  changeLinkedAgent(id) {
    this.ticketsService.linkedAgentToTicket(this.ticketProfile.id, id).subscribe(res => {

    })
  }
  isSeletedDevice(item) {
    return this.selectedDevice && this.selectedDevice.deviceId === item.deviceId;
  }
  onCloseDropDown(data) {
    if (!data) {
      this.elRef.nativeElement.querySelector("#search-user").value = "";
      this.devicesList = this.devices.sort((a, b) => (`${a.getLabelForEdit()}`.toLowerCase() > `${b.getLabelForEdit()}`.toLowerCase()) ?
        1 : ((`${b.getLabelForEdit()}`.toLowerCase() > `${a.getLabelForEdit()}`.toLowerCase()) ? -1 : 0));
    }
  }
}
