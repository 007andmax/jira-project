import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDefaultSubscriptionComponent } from './user-default-subscription.component';

@NgModule({
    declarations: [UserDefaultSubscriptionComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [UserDefaultSubscriptionComponent]

})
export class UserDefaultSubscriptionModule { }
