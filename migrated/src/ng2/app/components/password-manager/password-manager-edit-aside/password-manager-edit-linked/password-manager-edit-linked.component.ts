import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/quote/company';
import { GadgetsService } from 'src/ng2/app/services/gadgets/gadgets.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { PasswordDeviceUser } from '../../class/password-device-user';

@Component({
  selector: 'app-password-manager-edit-linked',
  templateUrl: './password-manager-edit-linked.component.html',
  styleUrls: ['./password-manager-edit-linked.component.scss']
})
export class PasswordManagerEditLinkedComponent implements OnInit {
  @Input() selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  @Input() selectedClient: Company;
  showSelect = false;
  @Input() type: string;
  @Input() title: string;
  @Input() placeholder: string;
  list: Array<PasswordDeviceUser> = [];
  @Output() onChange = new EventEmitter<any>();

  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    private gadgetsService: GadgetsService,
    private devicesStateService: DevicesStateService) { }

  ngOnInit() {
    if (this.type === 'USERS') {
      let users = this.usersStateService.getAllUsers().filter(item => item.company.id === this.selectedClient.id);
      users.forEach(item => {
        this.list.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
    }
    if (this.type === 'DEVICES') {
      let devices = (this.devicesStateService.getAllDevices()[this.selectedClient.id]) ? this.devicesStateService.getAllDevices()[this.selectedClient.id] : [];
      devices.forEach(item => {
        this.list.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })
    }
    if (this.type === 'GADGETS') this.getGadgets();
    console.log("this.list", this.list);
  }
  public getGadgets() {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) => {
      this.list = res.map(item => new PasswordDeviceUser(item.id, item.name, 'GADGET'));
      console.log("this.list", this.list);
    });
  }
  isSeleted(item) {
    return this.selectedUserAndDevices.find(element => element.id === item.id);
  }
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
    this.cd.detectChanges();
  }
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  getLabelDevice(item) {
    if (item.label) return item.label;
    return item.hostName || item.ip;
  }
  public hideSelectWrapper() {
    this.showSelect = false;
  }
  removeItem(index) {
    this.selectedUserAndDevices.splice(index, 1);
  }
  getTitle() {
    return `${this.title} (${this.selectedUserAndDevices.length})`
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedUserAndDevices.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedUserAndDevices.splice(findIndex, 1);
    } else {
      this.selectedUserAndDevices.push(newItem);
    }
    this.onChange.emit(this.selectedUserAndDevices);
  }

}
