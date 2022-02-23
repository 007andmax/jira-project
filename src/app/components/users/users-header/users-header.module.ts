import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersHeaderComponent } from './users-header.component';
import { UsersFilterComponent } from './users-filter/users-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { UsersFilterSubscriptionsComponent } from './users-filter/users-filter-subscriptions/users-filter-subscriptions.component';
import { MatChipsModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';



@NgModule({
    declarations: [
        UsersHeaderComponent,
        UsersFilterComponent,
        UsersFilterSubscriptionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        MatChipsModule,
        NgbModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        CompanyTagsModule
    ],
    exports: [UsersHeaderComponent]
})
export class UsersHeaderModule { }
