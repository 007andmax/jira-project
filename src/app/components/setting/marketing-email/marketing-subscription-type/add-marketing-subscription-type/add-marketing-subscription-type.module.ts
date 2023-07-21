import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMarketingSubscriptionTypeComponent } from './add-marketing-subscription-type.component';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [AddMarketingSubscriptionTypeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClickOtsideModule,
        MatFormFieldModule

    ],
    exports: [AddMarketingSubscriptionTypeComponent]
})
export class AddMarketingSubscriptionTypeModule { }
