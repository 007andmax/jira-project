import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { SubscriptionServicesItemComponent } from './subscription-services-item/subscription-services-item.component';
import { SubscriptionServicesRoutingModule } from './subscription-services-routing.module';
import { SubscriptionServicesComponent } from './subscription-services.component';
import { SubscriptionServicesAddComponent } from './subscription-services-add/subscription-services-add.component';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { TaxesModule } from '../../shared/taxes/taxes.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { SubscriptionServicesEditComponent } from './subscription-services-edit/subscription-services-edit.component';
import { SubscriptionServicesCheckUseComponent } from './subscription-services-check-use/subscription-services-check-use.component';




@NgModule({
    declarations: [SubscriptionServicesComponent,
        SubscriptionServicesItemComponent,
        SubscriptionServicesAddComponent,
        SubscriptionServicesEditComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        DropDownModule,
        FormsModule,
        SubscriptionServicesRoutingModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        ReactiveFormsModule,
        MatErrorModule,
        TaxesModule,
        ToFixedModule,
        NumberModule
    ],



})
export class SubscriptionServicesModule { }
