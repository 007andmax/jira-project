import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserGlobalFilter } from '../class/user-global-filters';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users/users.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MODE_MARKETING_USERS_LIST, TYPE_LIST_MARKETING_USERS } from 'src/app/const/users';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UserFilterSaveValidate } from './class/user-filter-save-validate';

@Component({
  selector: 'app-user-filter-save',
  templateUrl: './user-filter-save.component.html',
  styleUrls: ['./user-filter-save.component.scss']
})
export class UserFilterSaveComponent implements OnInit {
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  @Input() globalFilter: UserGlobalFilter;
  oldName: string;
  isDisabled: boolean = false;
  validate: UserFilterSaveValidate = new UserFilterSaveValidate();
  constructor(public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    private usersService: UsersService,) { }

  ngOnInit() {
    this.oldName = JSON.parse(JSON.stringify(this.globalFilter.name));
    if (this.globalFilter.global && this.getPermissions('CREATE_GLOBAL_USER_FILTER') && !this.getPermissions('EDIT_GLOBAL_USER_FILTER')) this.isDisabled = true;
  }
  /**
* @description Confirm and close modal
*/
  cancelConfirm() {
    this.addBtn.setDisabled(false);
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };

  onChangeName() {
    if (this.globalFilter.global && this.getPermissions('CREATE_GLOBAL_USER_FILTER') && !this.getPermissions('EDIT_GLOBAL_USER_FILTER') && this.oldName !== this.globalFilter.name) this.isDisabled = false;
    if (this.globalFilter.global && this.getPermissions('CREATE_GLOBAL_USER_FILTER') && !this.getPermissions('EDIT_GLOBAL_USER_FILTER') && this.oldName === this.globalFilter.name) this.isDisabled = true;
    this.validate.checkValidName(this.globalFilter.name);
  }
  /**
* @description Init request to add / edit global filter
*/
  save() {
    if (!this.validate.isValidate(this.globalFilter)) return;
    this.addBtn.setDisabled(true);
    this.globalFilter.setForMarketing(this.usersStateService.getModeUserFilterSubscription() == MODE_MARKETING_USERS_LIST);
    if (!this.globalFilter.id) {
      this.usersService.addGlobalFilter(this.globalFilter.getDataForRequest()).subscribe(data => {
        this.usersStateService.onFastAddGlobalFilter.next(data);
        this.cancelConfirm();
      })
    } else {
      if (this.oldName !== this.globalFilter.name) {
        this.usersService.addGlobalFilter(this.globalFilter.getDataForRequest()).subscribe(data => {
          this.usersStateService.onFastAddGlobalFilter.next(data);
          this.cancelConfirm();
        })
      } else {
        this.usersService.editGlobalFilter(this.globalFilter.id, this.globalFilter.getDataForRequest()).subscribe(data => {
          this.usersStateService.onFastAddGlobalFilter.next(data);
          this.cancelConfirm();
        })
      }
    }
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

}
