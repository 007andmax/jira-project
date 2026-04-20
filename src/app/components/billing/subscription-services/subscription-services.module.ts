import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionServicesItemComponent } from './subscription-services-item/subscription-services-item.component';
import { SubscriptionServicesRoutingModule } from './subscription-services-routing.module';
import { SubscriptionServicesComponent } from './subscription-services.component';
import { SubscriptionServicesAddComponent } from './subscription-services-add/subscription-services-add.component';






import { SubscriptionServicesEditComponent } from './subscription-services-edit/subscription-services-edit.component';
import { SubscriptionServicesCheckUseComponent } from './subscription-services-check-use/subscription-services-check-use.component';





@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    SubscriptionServicesRoutingModule,
    ReactiveFormsModule,
    SubscriptionServicesComponent,
    SubscriptionServicesItemComponent,
    SubscriptionServicesAddComponent,
    SubscriptionServicesEditComponent
],
})
export class SubscriptionServicesModule { }
