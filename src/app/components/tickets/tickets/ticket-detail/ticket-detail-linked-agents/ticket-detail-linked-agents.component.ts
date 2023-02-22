import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { PasswordDeviceUser } from 'src/app/components/password-manager/class/password-device-user';
import { PasswordManagerLinkedComponent } from 'src/app/components/password-manager/password-manager-add-aside/password-manager-linked/password-manager-linked.component';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-linked-agents',
  templateUrl: './ticket-detail-linked-agents.component.html',
  styleUrls: ['./ticket-detail-linked-agents.component.scss']
})
export class TicketDetailLinkedAgentsComponent extends PasswordManagerLinkedComponent {

  @Input() selectedCompanyId: string;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  selectedDevice;
  onSelectCompany(id) {
    this.usersList = [];
    this.devicesList = [];
    this.gadgets = [];
    this.selectedCompanyId = null;
    if (id) {
      this.selectedCompanyId = id;
      let devices = (this.devicesStateService.getAllDevices() && this.devicesStateService.getAllDevices()[id]) ? this.devicesStateService.getAllDevices()[id] : [];
      devices.forEach(item => {
        this.devicesList.push(item);
        if (this.ticketProfile.agent && this.ticketProfile.agent.deviceId == item.id) this.selectedDevice = item;
      })
      this.devicesList.sort((a, b) => (`${a.name}`.toLowerCase() > `${b.name}`.toLowerCase()) ?
        1 : ((`${b.name}`.toLowerCase() > `${a.name}`.toLowerCase()) ? -1 : 0));
      console.log("this.devicesList", this.devicesList);
    }
  }
  public onSearch(event) {
    this.devicesList = this.devicesStateService.getAllDevices()[this.selectedCompanyId].filter(item => this.getLabelDevice(item).toLowerCase().includes(event.target.value.toLowerCase()))
      .sort((a, b) => (`${a.name}`.toLowerCase() > `${b.name}`.toLowerCase()) ?
        1 : ((`${b.name}`.toLowerCase() > `${a.name}`.toLowerCase()) ? -1 : 0));
    this.cd.detectChanges();
  }
  public selected(newItem) {
    this.selectedDevice = newItem;
    this.changeLinkedAgent(newItem.id);
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
    return this.selectedDevice && this.selectedDevice.id === item.id;
  }
}
