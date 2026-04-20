import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPermissions } from 'src/app/components/users/class/user-permissions';
import { UserRole } from 'src/app/components/users/class/user-role';
import { UsersService } from 'src/app/services/users/users.service';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipComponent } from '../../../shared/dynamic-tooltip/dynamic-tooltip.component';

@Component({
    selector: 'customer-permissions-edit',
    templateUrl: './customer-permissions-edit.component.html',
    styleUrls: ['./customer-permissions-edit.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, DynamicTooltipComponent, FormsModule]
})
export class CustomerPermissionsEditComponent implements OnInit {
  @Input() role: UserRole;
  @Input() userPermissions: Array<UserPermissions> = [];
  editRole: UserRole;
  @ViewChild('addCustomer', { static: true }) addCustomer: NgbDropdown;
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.editRole = new UserRole(JSON.parse(JSON.stringify(this.role)));
  }
  close() {
    this.addCustomer.close();
  }

  changeRole() {
    if (this.editRole.name.length > 0) {
      this.usersService.changePermission(this.editRole.id, this.editRole.getDataForRequest(this.userPermissions.find(item => item.id == this.editRole.id).permissions)).subscribe(data => {
        this.close()
      })
    }
  }
}
