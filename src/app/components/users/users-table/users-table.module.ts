import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { UserTableSubscriptionComponent } from './user-table-subscription/user-table-subscription.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTableDefaultSubscriptionComponent } from './user-table-default-subscription/user-table-default-subscription.component';
import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription/user-table-custom-subscription.component';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';






@NgModule({
    declarations: [
        UsersTableComponent,
        UserTableSubscriptionComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    NgbModule,
    PreviewPhoneMaskModule
],
    exports: [UsersTableComponent]
})
export class UsersTableModule { }
