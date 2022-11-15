import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDefaultSubscriptionComponent } from './user-default-subscription.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [UserDefaultSubscriptionComponent,
    ],
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [UserDefaultSubscriptionComponent]

})
export class UserDefaultSubscriptionModule { }
