import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesComponent } from './companies.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesHeaderComponent } from './companies-header/companies-header.component';
import { CompaniesTableComponent } from './companies-table/companies-table.component';
import { CompanyAddAsideComponent } from './company-add-aside/company-add-aside.component';
import { CompanyEditAsideModule } from './company-edit-aside/company-edit-aside.module';
import { CompanySubscriptionModule } from './company-subscription/company-subscription.module';
import { CompaniesFilterComponent } from './companies-header/companies-filter/companies-filter.component';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { NgxMaskModule } from 'ngx-mask';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { CompanyTagsModule } from './company-tags/company-tags.module';

@NgModule({
    declarations: [CompaniesComponent,
        CompaniesHeaderComponent,
        CompaniesTableComponent,
        CompaniesFilterComponent,
    ],
    imports: [
        CommonModule,
        CompaniesRoutingModule,
        InfiniteScrollModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,
        CompanyEditAsideModule,
        CompanySubscriptionModule,
        PhoneModule,
        NgxMaskModule.forRoot(),
        PreparePhoneModule,
        DynamicTooltipModule,
        DropDownModule,
        CompanyTagsModule
    ],



})
export class CompaniesModule { }
