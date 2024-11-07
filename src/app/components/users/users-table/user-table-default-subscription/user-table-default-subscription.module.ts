import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTableDefaultSubscriptionComponent } from './user-table-default-subscription.component';


@NgModule({
    declarations: [
        UserTableDefaultSubscriptionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule
    ],
    exports: [UserTableDefaultSubscriptionComponent]
})
export class UserTableDefaultSubscriptionModule { }
