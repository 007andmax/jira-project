import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceAgreementBlockTimeServices } from '../../../class/service-agreement-block-time-services';

@Component({
  selector: 'app-contracts-aside-block-time-edit-customer-service',
  templateUrl: './contracts-aside-block-time-edit-customer-service.component.html',
  styleUrls: ['./contracts-aside-block-time-edit-customer-service.component.scss']
})
export class ContractsAsideBlockTimeEditCustomerServiceComponent implements OnInit {

  @Input() service: ServiceAgreementBlockTimeServices;
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
