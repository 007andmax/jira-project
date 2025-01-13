import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent } from './contracts-aside-block-time-billing-add-subscription-services.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
  declarations: [ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    MatErrorModule
  ],
  exports: [ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent]
})
export class ContractsAsideBlockTimeBillingAddSubscriptionServicesModule { }
