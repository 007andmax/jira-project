import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCustomSubscriptionComponent } from './user-custom-subscription.component';

@NgModule({
    declarations: [UserCustomSubscriptionComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [UserCustomSubscriptionComponent]

})
export class UserCustomSubscriptionModule { }
