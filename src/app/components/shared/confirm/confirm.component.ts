import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ConfirmStateService } from './services/confirm-state.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfrmData } from './class/confirm-data';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  @Input() public message = '';
  action: string = null;
  btnCancel: string = 'no';
  buttonConfirm: string = 'yes';
  sub: Subscription = new Subscription();
  @ViewChild('approveBtn', { static: false }) approveBtn: DisabledBtnDirective;
  constructor(private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal, private eRef: ElementRef,) {

  }


  ngOnInit() {
    this.action = this.confirmStateService.getConfirmAction();
    let onInitRequest = this.confirmStateService.onInitRequest.subscribe(res => {
      if (!res) {
        this.approveBtn.setDisabled(false);
        this.cancelConfirm();
      }
    })
    this.sub.add(onInitRequest);
  }
  closeModal() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(null);

    /*  if (closeFn) closeFn();
      $uibModalInstance.dismiss();*/
  }

  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);

    /*  rejectFn();
      $uibModalInstance.dismiss();*/
  };

  approveConfirmByRequest() {
    this.approveBtn.setDisabled(true);
    this.confirmStateService.initRequest(true);
    this.confirmStateService.setConfirm(true);
  }
  approveConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(true);
  };
  public isDefault() {
    return this.action !== 'ARCHIVE_USER'
      && this.action !== 'ARCHIVE_COMPANY'
      && this.action !== 'DEARCHIVE_COMPANY'
      && this.action !== 'DELETE_MANAGE_TAG'
      && this.action !== 'DELETE_DEVICE_TAG'
      && this.action !== 'CHANGE_COMMISSION_PRODUCT'
      && this.action !== 'CHANGE_COMMISSION_SERVICE'
      && this.action !== 'RESTORE_USER'
      && this.action !== 'REMOVE_TASK_TICKET'
      && this.action !== 'REMOVE_ATTACHMENT'
      && this.action !== 'DELETE_COMMAND'
      && this.action !== 'DELETE_SUBSCRIPTION_TYPE'
      && this.action !== 'CHANGE_COMPANY_TICKET'
      && this.action !== 'DELETE_GLOBAL_FILTER'
      && this.action !== 'DELETE_GLOBAL_USERS_FILTER'
      && this.action !== 'ROLLBACK_INVOICE'
      && this.action !== 'DELETE_NEWS'
      && this.action !== 'REMOVE_CATEGORY_FILES'
      && this.action !== 'REMOVE_FILE'
      && this.action !== 'DELETE_TASK'
      && this.action !== 'ARCHIVE_TASK'
      && this.action !== 'REMOVE_CARD'
      && this.action !== 'DISCONNECT_CONNECTION'
      && !this.isSignaturePage()
      && !this.isSettingsPage();
  }
  public isSignaturePage() {
    return this.action === 'DELETE_SIGNATURE';
  }
  public isSettingsPage() {
    return this.action === 'DELETE_GL_NUMBER' ||
      this.action === 'DELETE_LIST_GL_NUMBERS' ||
      this.action === 'DELETE_CRM_INDUSTRY' ||
      this.action === 'DELETE_CRM_INDUSTRIES' ||
      this.action === 'DELETE_CRM_SERVICE_TYPE' ||
      this.action === 'DELETE_CRM_SERVICE_TYPIES' ||
      this.action === 'DELETE_CRM_JOB_TITLE' ||
      this.action === 'DELETE_CRM_JOB_TITLIES' ||
      this.action === 'DELETE_CRM_JOB_TYPE' ||
      this.action === 'DELETE_CRM_JOB_TYPIES' ||
      this.action === 'DELETE_TICKET_STATUS' ||
      this.action === 'DELETE_LIST_TICKET_STATUS' ||
      this.action === 'DELETE_CATEGORIES_PRODUCT' ||
      this.action === 'DELETE_CATEGORY_PRODUCT' ||
      this.action === 'DELETE_SUBSCRIPTION_TYPIES' ||
      this.action === 'DELETE_SUBSCRIPTION_USER' ||
      this.action === 'DELETE_DEVICE_TYPE' ||
      this.action === 'DELETE_DEVICE_MANUFACTURE' ||
      this.action === 'DELETE_DEVICE_MODEL' ||
      this.action === 'CLOSE_SESSION' ||
      this.action === 'DELETE_USER_ROLE' ||
      this.action == 'DELETE_NOTE' ||
      this.action == 'DELETE_API_KEY'
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
