import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCustomSubscriptionComponent } from './user-custom-subscription.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [UserCustomSubscriptionComponent,
    ],
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [UserCustomSubscriptionComponent]

})
export class UserCustomSubscriptionModule { }
