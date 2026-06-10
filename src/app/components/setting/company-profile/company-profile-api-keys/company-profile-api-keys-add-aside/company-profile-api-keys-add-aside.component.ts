
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiKeys } from '../class/api-keys';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PermissionManageService } from 'src/app/services/permission-manage/permission-manage.service';
import { ApiKeysStateService } from 'src/app/states/api-keys/api-keys-state.service';
import { ApiKeysService } from 'src/app/services/api-keys/api-keys.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { PreloaderTicketComponent } from 'src/app/components/shared/preloader-ticket/preloader-ticket.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, PreloaderTicketComponent, ReactiveFormsModule, DisabledBtnDirective, CommonModule],
  selector: 'app-company-profile-api-keys-add-aside',
  templateUrl: './company-profile-api-keys-add-aside.component.html',
  styleUrls: ['./company-profile-api-keys-add-aside.component.scss']
})
export class CompanyProfileApiKeysAddAsideComponent implements OnInit {
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  opened: boolean = false;
  sections = {};
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  companiesRelatedPermissions = [];
  agreementRelatedPermissions = [];
  userRelatedPermissions = [];
  ticketRelatedPermissions = [];
  accountingRelatedPermissions = [];
  productsRelatedPermissions = [];
  passwordsRelatedPermissions = [];
  viewPasswordsRelatedPermissions = [];
  viewDocumentsRelatedPermissions = [];
  editCategoryDocumentsRelatedPermissions = [];
  constructor(public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    private permissionManageService: PermissionManageService,
    private apiKeysStateService: ApiKeysStateService,
    private apiKeysService: ApiKeysService) { }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      title: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
      ],
      permissions: [
        []
      ],
    })
    this.sections = this.permissionManageService.getsections();
    this.companiesRelatedPermissions = this.permissionManageService.getCompaniesRelatedPermissions();
    this.agreementRelatedPermissions = this.permissionManageService.getAgreementRelatedPermissions();
    this.userRelatedPermissions = this.permissionManageService.getUserRelatedPermissions();
    this.ticketRelatedPermissions = this.permissionManageService.getTicketRelatedPermissions();
    this.accountingRelatedPermissions = this.permissionManageService.getAccountingRelatedPermissions();
    this.productsRelatedPermissions = this.permissionManageService.getProductsRelatedPermissions();
    this.passwordsRelatedPermissions = this.permissionManageService.getPasswordsRelatedPermissions();
    this.viewPasswordsRelatedPermissions = this.permissionManageService.getViewPasswordsRelatedPermissions();
    this.viewDocumentsRelatedPermissions = this.permissionManageService.getViewDocumentsRelatedPermissions();
    this.editCategoryDocumentsRelatedPermissions = this.permissionManageService.getEditCategoryDocumentsRelatedPermissions();
    this.apiKeysStateService.onAdd.subscribe((data) => {
      this.opened = true;
      this.cd.detectChanges();
    });
  }
  userReadable(str: string) {
    return str
      .split('_')
      .map(function (word) {
        return word[0] + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  togglePermission(permission) {
    let list = this.modelForm.controls["permissions"].value;
    if (list.indexOf(permission) > -1) {
      list.splice(list.indexOf(permission), 1);
    } else {
      list.push(permission);
    }
    this.modelForm.controls["permissions"].setValue(list);
  }
  closed() {
    this.submitted = false;
    this.opened = false;
    this.modelForm.reset();
    this.modelForm.controls["permissions"].setValue([]);
  }
  add() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.addBtn.setDisabled(true);
    this.apiKeysService.add(this.modelForm.value).subscribe(data => {
      this.apiKeysStateService.fastAdd(data);
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  isPermissionDisabled(permission) {
    if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_COMPANIES') === -1 &&
      this.companiesRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_USERS') === -1 &&
      this.userRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_ACCOUNTING') === -1 &&
      this.accountingRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_PRODUCT_COST') === -1 &&
      this.productsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_PASSWORD_SECTION') === -1 &&
      this.passwordsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_PASSWORD') === -1 &&
      this.viewPasswordsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_DOCUMENT') === -1 &&
      this.viewDocumentsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('EDIT_CATEGORY') === -1 &&
      this.editCategoryDocumentsRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('EDIT_TICKETS') === -1 &&
      this.ticketRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else if (
      this.modelForm.controls["permissions"].value.indexOf('VIEW_SERVICE_AGREEMENTS') === -1 &&
      this.agreementRelatedPermissions.indexOf(permission) > -1
    ) {
      return true;
    } else {
      return false;
    }

  }
  get f2() {
    return this.modelForm.controls;
  }
}
