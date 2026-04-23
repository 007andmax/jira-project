import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DeviceCompany } from '../../class/device-company';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-company-devices-no-exist-remote-sessions',
  templateUrl: './company-devices-no-exist-remote-sessions.component.html',
  styleUrls: ['./company-devices-no-exist-remote-sessions.component.scss'],

})
export class CompanyDevicesNoExistRemoteSessionsComponent implements OnInit {
  @Input() device: DeviceCompany;
  @Output() onRemoteAccess = new EventEmitter();
  constructor(private permissionsService: PermissionsService,
    private usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService) { }

  ngOnInit() {
  }
  public getUserName(userId) {
    let user = this.usersStateService.getAllUsers().find(item => item.id === userId);
    return (user) ? `${user.firstName} ${user.lastName}` : '';
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
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  remoteAccess(data) {
    this.onRemoteAccess.emit(data);
  }
}
