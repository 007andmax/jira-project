import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContractsBlockTimeService } from '../../class/contracts-block-time-service';
import { MatErrorComponent } from '../../../../../shared/mat-error/mat-error.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-contracts-aside-block-time-billing-customer-service',
    templateUrl: './contracts-aside-block-time-billing-customer-service.component.html',
    styleUrls: ['./contracts-aside-block-time-billing-customer-service.component.scss'],
    standalone: true,
    imports: [NgIf, MatErrorComponent]
})
export class ContractsAsideBlockTimeBillingCustomerServiceComponent implements OnInit {
  @Input() service: ContractsBlockTimeService;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onCheckName = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  onChange() {
    this.service.setValidate(true);
    this.service.setValidateDuplicated(true);
  }
  remove() {
    this.onRemove.emit(null);
  }
  checkName() {
    this.onCheckName.emit(null);
  }

}
