import { Component } from '@angular/core';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { MatErrorComponent } from '../../shared/mat-error/mat-error.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-passwoord-manager-devices-users',
    templateUrl: './passwoord-manager-devices-users.component.html',
    styleUrls: ['./passwoord-manager-devices-users.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgClass, NgStyle, NgIf, MatErrorComponent, NgFor]
})
export class PasswoordManagerDevicesUsersComponent extends DropDownComponent {


  isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
}
