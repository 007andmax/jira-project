import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TechUsersService } from 'src/app/services/setting/tech-users.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from '../../class/user';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-add-user-to-company-item',
  templateUrl: './add-user-to-company-item.component.html',
  styleUrls: ['./add-user-to-company-item.component.scss'],

})
export class AddUserToCompanyItemComponent implements OnInit {
  @Input() selected: boolean = false;
  @Input() user: User;
  @Output() onSelectUser = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public customerPortalStateService: CustomerPortalStateService,
  ) { }

  ngOnInit() {
  }
  getUserName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  selectUser() {
    this.user.selected = !this.user.selected;
    this.onSelectUser.emit(this.user);
    if (!this.cd['destroyed']) this.cd.detectChanges();
  }
}
