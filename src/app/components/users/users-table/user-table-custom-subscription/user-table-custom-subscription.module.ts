import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription.component';


@NgModule({
    declarations: [
        UserTableCustomSubscriptionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [UserTableCustomSubscriptionComponent]
})
export class UserTableCustomSubscriptionModule { }
