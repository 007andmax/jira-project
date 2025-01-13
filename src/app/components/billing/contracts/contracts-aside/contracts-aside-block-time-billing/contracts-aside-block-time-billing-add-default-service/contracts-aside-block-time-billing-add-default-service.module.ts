import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideBlockTimeBillingAddDefaultServiceComponent } from './contracts-aside-block-time-billing-add-default-service.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [ContractsAsideBlockTimeBillingAddDefaultServiceComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [ContractsAsideBlockTimeBillingAddDefaultServiceComponent]


})
export class ContractsAsideBlockTimeBillingAddDefaultServiceModule { }
