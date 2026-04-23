
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ConfirmStateService } from './services/confirm-state.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfrmData } from './class/confirm-data';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { Subscription } from 'rxjs';
import { PreloaderTicketComponent } from '../preloader-ticket/preloader-ticket.component';

@Component({
  standalone: true,
  imports: [PreloaderTicketComponent, CommonModule],
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit, OnDestroy {
  @Input() public header = '';
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
