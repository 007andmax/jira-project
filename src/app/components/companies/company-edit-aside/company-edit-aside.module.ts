import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyEditAsideComponent } from './company-edit-aside.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanySubscriptionModule } from '../company-subscription/company-subscription.module';
import { CompanyTimeZoneModule } from '../company-time-zone/company-time-zone.module';
import { CompanyTagsModule } from '../company-tags/company-tags.module';
import { CompanyAssociateModule } from '../../company-dashboard/company-dash-associate/company-associate/company-associate.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { CompaniesFilterComponent } from '../companies-header/companies-filter/companies-filter.component';

@NgModule({
    declarations: [CompanyEditAsideComponent,


    ],
    imports: [
        CommonModule,
        MatSelectModule,
        FormsModule,
        MatChipsModule,
        NgbModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTimeZoneModule,
        CompanyTagsModule,
        CompanyAssociateModule,
        TextAreaModule

    ],
    exports: [CompanyEditAsideComponent]


})
export class CompanyEditAsideModule { }
