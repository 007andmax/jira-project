import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ConfirmStateService } from './services/confirm-state.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfrmData } from './class/confirm-data';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @Input() public message = '';
  action: string = null;
  btnCancel: string = 'no';
  buttonConfirm: string = 'yes';
  constructor(private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal, private eRef: ElementRef,) {

  }

  ngOnInit() {
    this.action = this.confirmStateService.getConfirmAction();
  }
  closeModal() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);

    /*  if (closeFn) closeFn();
      $uibModalInstance.dismiss();*/
  }

  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);

    /*  rejectFn();
      $uibModalInstance.dismiss();*/
  };

  approveConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(true);

    /*    approveFn()
        $uibModalInstance.close(result);*/
  };
  public isDefault() {
    return this.action !== 'ARCHIVE_USER'
      && this.action !== 'ARCHIVE_COMPANY'
      && this.action !== 'DEARCHIVE_COMPANY'
      && this.action !== 'DELETE_MANAGE_TAG'
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
      this.action === 'DELETE_SUBSCRIPTION_TYPE' ||
      this.action === 'DELETE_SUBSCRIPTION_TYPIES' ||
      this.action === 'DELETE_SUBSCRIPTION_USER' ||
      this.action === 'CLOSE_SESSION'

  }

}
