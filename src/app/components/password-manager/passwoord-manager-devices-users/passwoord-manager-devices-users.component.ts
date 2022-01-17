import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';

@Component({
  selector: 'app-passwoord-manager-devices-users',
  templateUrl: './passwoord-manager-devices-users.component.html',
  styleUrls: ['./passwoord-manager-devices-users.component.scss']
})
export class PasswoordManagerDevicesUsersComponent extends DropDownComponent {


  isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
}
