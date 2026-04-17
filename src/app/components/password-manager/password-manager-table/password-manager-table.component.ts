import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { REMOVE_RECORD } from 'src/app/const/confirm';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PasswordRecord } from '../class/password-record';
import { PasswordRecordCategories } from '../class/password-record-categories';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { Company } from 'src/app/interfaces/company/company';

/**
 * Password manager data table component
 */
@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss'],
  providers: [TicketsListService]

})
export class PasswordManagerTableComponent implements OnInit, OnDestroy {
  @Input() item: PasswordRecord;
  @Output() onSelectRecord = new EventEmitter<any>();
  company: Company;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  togglePassword: boolean = false;
  categories: Array<PasswordRecordCategories> = [];
  sub: Subscription = new Subscription();
  constructor(private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private passwordManagerStateService: PasswordManagerStateService,
    private passwordManagerService: PasswordManagerService,
    public cd: ChangeDetectorRef,
    private toastrService: ToastrService,
    private companiesStateService: CompaniesStateService,
    public ticketsListService: TicketsListService,
    private appStateService: AppStateService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.item.companyId);
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
    })
    let onChangePassword = this.passwordManagerStateService.onChangePassword.subscribe(data => {
      if (data.id == this.item.id) this.item.setPassword(data.password);
      this.cd.detectChanges();
    })
    this.sub.add(onChangePassword);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_UPDATED' && newChange.data.id == this.item.id) this.togglePassword = false;
      if (!this.cd['destroyed']) this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
  }
  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }
  parseLogo() {
    if (this.checkLogo()) {
      return `url(${this.companiesStateService.getCompanyLogoUrl(this.company)}) center / cover no-repeat`;
    } else {
      return this.ticketsListService.getStyleAvatar(null, this.listColorNoAvatar[this.indexNoAvatar]);
    }
  }
  selectRecord(event) {
    this.onSelectRecord.emit(this.item);
    this.cd.detectChanges();
  }
  showPassword() {
    this.passwordManagerService.setOpenRecord(this.item.id).subscribe((data: any) => {
      this.item.setPassword(data.password);
      this.togglePassword = true;
    })
  }
  copy(value) {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = value
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  isExpired() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    return expired < current;
  }
  isExpiredLess30() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    let day = (expired - current) / 86400000;
    return day <= 30;
  }
  deleteRecord() {
    this.confirmStateService.setConfirmAction(REMOVE_RECORD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Password Record`;
    modalRef.componentInstance.message = `Are you sure you want to delete the password record?`;
    this.passwordManagerStateService.setRecordForRemove(this.item);
  }
  public editRecord() {
    if (this.getPermissions('VIEW_PASSWORD')) this.passwordManagerService.showEditFrom(this.item);
  }
  parseExpiredDate() {
    let current = new Date().getTime();
    let expired = new Date(this.item.expiredDate).getTime();
    let day = (expired - current) / 86400000;
    return `${Math.round(day)} days to expire`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
