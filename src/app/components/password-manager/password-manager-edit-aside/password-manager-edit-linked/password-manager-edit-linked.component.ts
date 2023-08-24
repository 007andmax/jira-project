import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Company } from 'src/app/interfaces/quote/company';
import { GadgetsService } from 'src/app/services/gadgets/gadgets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PasswordDeviceUser } from '../../class/password-device-user';
import { Device } from 'src/app/components/company-devices/class/device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-manager-edit-linked',
  templateUrl: './password-manager-edit-linked.component.html',
  styleUrls: ['./password-manager-edit-linked.component.scss']
})
export class PasswordManagerEditLinkedComponent implements OnInit, OnDestroy {
  @Input() selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  @Input() selectedClient: Company;
  showSelect = false;
  @Input() type: string;
  @Input() title: string;
  @Input() placeholder: string;
  list: Array<PasswordDeviceUser> = [];
  preloader: boolean = true;
  @Output() onChange = new EventEmitter<any>();
  companies: Array<Company> = [];
  isInitGetGadgets: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    private gadgetsService: GadgetsService,
    public devicesService: DevicesService,
    private companiesState: CompaniesStateService,
    private passwordManagerStateService: PasswordManagerStateService,
  ) { }


  ngOnInit() {
    let onGetDevices = this.passwordManagerStateService.onGetDevices.subscribe(data => {
      let devices = data;
      this.preloader = false;
      this.list = [];
      this.onGetList(devices);
    })
    this.sub.add(onGetDevices);
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
  }
  onGetList(devices) {
    if (this.type === 'USERS') {
      let users = this.usersStateService.getAllUsers().filter(item => {
        let company = this.companies.find(itemCompany => item.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === itemCompany.id));
        let isArchived = item.deletedAt || !company;
        return !isArchived && item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.selectedClient.id)
      });
      users.forEach(item => {
        this.list.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
    }
    if (this.type === 'DEVICES') {
      devices.forEach(item => {
        this.list.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })
    }
    this.list.sort((a, b) => (`${a.name}`.toLowerCase() > `${b.name}`.toLowerCase()) ?
      1 : ((`${b.name}`.toLowerCase() > `${a.name}`.toLowerCase()) ? -1 : 0));
    if (this.type === 'GADGETS' && !this.isInitGetGadgets) this.getGadgets();
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public getGadgets() {
    this.isInitGetGadgets = true;
    this.gadgetsService.getCompanyDevices().subscribe((res: any) => {
      this.list = res.map(item => new PasswordDeviceUser(item.id, item.name, 'GADGET'));
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
