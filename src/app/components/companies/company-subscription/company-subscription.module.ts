import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanySubscriptionComponent } from './company-subscription.component';

@NgModule({
    declarations: [CompanySubscriptionComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [CompanySubscriptionComponent]



})
export class CompanySubscriptionModule { }
