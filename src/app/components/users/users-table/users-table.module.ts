import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { FormsModule } from '@angular/forms';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { NgxMaskModule } from 'ngx-mask';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { UserTableSubscriptionComponent } from './user-table-subscription/user-table-subscription.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
    declarations: [
        UsersTableComponent,
        UserTableSubscriptionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PhoneModule,
        NgxMaskModule.forRoot(),
        PreparePhoneModule,
        DynamicTooltipModule,
        NgbModule,
    ],
    exports: [UsersTableComponent]



})
export class UsersTableModule { }
