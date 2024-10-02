import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersHeaderComponent } from './users-header.component';
import { UsersFilterComponent } from './users-filter/users-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { UsersFilterSubscriptionsComponent } from './users-filter/users-filter-subscriptions/users-filter-subscriptions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { UsersFilterJobTitleComponent } from './users-filter/users-filter-job-title/users-filter-job-title.component';
import { UsersFilterInfoComponent } from './users-filter-info/users-filter-info.component';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';



@NgModule({
    declarations: [
        UsersHeaderComponent,
        UsersFilterSubscriptionsComponent,
        UsersFilterInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        CompanyTagsModule,
        CompanyDropDownModule,
        MatChipListModule,
        MatChipModule,
    ],
    exports: [UsersHeaderComponent]
})
export class UsersHeaderModule { }
