import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMarketingSubscriptionTypeComponent } from './add-marketing-subscription-type.component';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [AddMarketingSubscriptionTypeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        MatErrorModule

    ],
    exports: [AddMarketingSubscriptionTypeComponent]
})
export class AddMarketingSubscriptionTypeModule { }
