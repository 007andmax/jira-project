import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DeviceCompany } from '../../class/device-company';

@Component({
  selector: 'app-company-devices-exist-remote-sessions',
  templateUrl: './company-devices-exist-remote-sessions.component.html',
  styleUrls: ['./company-devices-exist-remote-sessions.component.scss']
})
export class CompanyDevicesExistRemoteSessionsComponent implements OnInit {
  @Input() device: DeviceCompany;
  @Output() onRemoteAccess = new EventEmitter();
  constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService,) { }

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
