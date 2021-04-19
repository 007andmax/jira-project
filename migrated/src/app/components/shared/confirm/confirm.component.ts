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
  action:string = null;
  btnCancel: string = 'no';
  buttonConfirm: string = 'yes';
  constructor(private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal, private eRef: ElementRef, ) {

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

}
