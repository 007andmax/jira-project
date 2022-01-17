import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAsideEditComponent } from './users-aside-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanySubscriptionModule } from '../../companies/company-subscription/company-subscription.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';

@NgModule({
    declarations: [UsersAsideEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTagsModule,
        TextAreaModule
    ],
    exports: [UsersAsideEditComponent]

})
export class UsersAsideEditModule { }
