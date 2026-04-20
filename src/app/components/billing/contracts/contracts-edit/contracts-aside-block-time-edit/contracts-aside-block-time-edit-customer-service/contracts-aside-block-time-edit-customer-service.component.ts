import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceAgreementBlockTimeServices } from '../../../class/service-agreement-block-time-services';
import { FormsModule } from '@angular/forms';
import { MatErrorComponent } from '../../../../../shared/mat-error/mat-error.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-contracts-aside-block-time-edit-customer-service',
    templateUrl: './contracts-aside-block-time-edit-customer-service.component.html',
    styleUrls: ['./contracts-aside-block-time-edit-customer-service.component.scss'],
    standalone: true,
    imports: [NgIf, MatErrorComponent, FormsModule, NgClass]
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
