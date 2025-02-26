import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';

@Component({
  selector: 'app-subscription-services-confirm',
  templateUrl: './subscription-services-confirm.component.html',
  styleUrls: ['./subscription-services-confirm.component.scss']
})
export class SubscriptionServicesConfirmComponent implements OnInit {
  @Input() public message = '';
  constructor(private subscriptionServicesStateService: SubscriptionServicesStateService,
    public activeModal: NgbActiveModal,) {
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

  cancelConfirm() {
    this.activeModal.close();
    this.subscriptionServicesStateService.setConfirm(false);
  };

  approveConfirm() {
    this.activeModal.close();
    this.subscriptionServicesStateService.setConfirm(true);
  };


}
