import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { GadgetsService } from 'src/app/services/gadgets/gadgets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PasswordDeviceUser } from '../../class/password-device-user';

import { PasswordRecordAdd } from '../../class/password-record-add';
import { PasswordRecordValidate } from '../../class/password-record-validate';

@Component({
  selector: 'password-manager-linked',
  templateUrl: './password-manager-linked.component.html',
  styleUrls: ['./password-manager-linked.component.scss']
})
export class PasswordManagerLinkedComponent implements OnInit {
  @Input() passwordRecordAdd: PasswordRecordAdd;
  @Input() validate: PasswordRecordValidate;
  public selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  public showSelect = false;
  public showGadgetsForm: any;
  public tabs = ['User', 'Device', 'Not monitored'];
  public currentTab = this.tabs[0];
  public devicesList = [];
  public usersList = [];
  public gadgets = [];
  public newGadgets: any;
  companies: Array<Company> = [];
  @Output() onSelectedItem = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(public cd: ChangeDetectorRef,
    private companiesState: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    private gadgetsService: GadgetsService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  onSelectCompany(data) {

    this.usersList = [];
    this.devicesList = [];
    this.gadgets = [];
    if (data) {
      let users = this.usersStateService.getAllUsers().filter(item => {
        let company = this.companies.find(itemCompany => itemCompany.id === item.company.id);
        let isArchived = item.deletedAt || !company;
        return !isArchived && item.company.id === data.id
      });
      users.forEach(item => {
        this.usersList.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
      this.usersList.sort((a, b) => (`${a.name}`.toLowerCase() > `${b.name}`.toLowerCase()) ?
        1 : ((`${b.name}`.toLowerCase() > `${a.name}`.toLowerCase()) ? -1 : 0));
      let devices = (this.devicesStateService.getAllDevices()[data.id]) ? this.devicesStateService.getAllDevices()[data.id] : [];
      devices.forEach(item => {
        this.devicesList.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })
      this.devicesList.sort((a, b) => (`${a.name}`.toLowerCase() > `${b.name}`.toLowerCase()) ?
        1 : ((`${b.name}`.toLowerCase() > `${a.name}`.toLowerCase()) ? -1 : 0));
      this.getGadgets();
    }
    this.validate.resetCompany();
  }
  public getGadgets() {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) => {
      this.gadgets = res.map(item => new PasswordDeviceUser(item.id, item.name, 'GADGET'));
    });
  }
  getLabelDevice(item) {
    if (item.label) return item.label;
    return item.hostName || item.ip;
  }
  public addGadgetsform() {
    const clientCompanyId = this.passwordRecordAdd.client.id;
    const name = this.newGadgets;
    this.gadgetsService.addNewGadget(clientCompanyId, name).subscribe((res: any) => {
      this.gadgets.push(new PasswordDeviceUser(res.id, res.name, 'GADGET'));
      this.showGadgetsForm = false;
    })
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedUserAndDevices.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedUserAndDevices.splice(findIndex, 1);
    } else {
      this.selectedUserAndDevices.push(newItem);
    }
    this.onSelectedItem.emit(this.selectedUserAndDevices);
    this.validate.resetLinkTo();
  }
  public showGadgetsAddForm($event) {
    this.stopEvent($event);
    this.showGadgetsForm = !this.showGadgetsForm;
  }
  public setCurrentTab($event, item) {
    this.stopEvent($event);
    this.currentTab = item;
    this.showGadgetsForm = false;
    this.cd.detectChanges();
  }
  public hideSelectWrapper() {
    this.showSelect = false;
    this.showGadgetsForm = false;
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
  public deleteGadget($event, id) {
    this.stopEvent($event);
    this.gadgetsService.deleteGadget(id)
      .subscribe((res: any) => this.gadgets = this.gadgets.filter((item) => item.id !== id))
  }
  public onClosed() {
    this.devicesList = [];
    this.usersList = [];
    this.gadgets = [];
    this.currentTab = this.tabs[0];
    this.showSelect = false;
  }
  isSeleted(item) {
    return this.selectedUserAndDevices.find(element => element.id === item.id);
  }
  removeItem(index) {
    this.selectedUserAndDevices.splice(index, 1);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
