import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CrmSettingsComponent } from './crm-settings.component';
import { CrmSettingsRoutingModule } from './crm-settings-routing.module';
import { CrmCompanyIndustryComponent } from './crm-company-industry/crm-company-industry.component';
import { CrmCompanyServiceTypeComponent } from './crm-company-service-type/crm-company-service-type.component';
import { CrmCompanyJobTitleComponent } from './crm-company-job-title/crm-company-job-title.component';
import { CrmCompanyJobTypeComponent } from './crm-company-job-type/crm-company-job-type.component';
import { AddCrmCompanyIndustryComponent } from './crm-company-industry/add-crm-company-industry/add-crm-company-industry.component';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { AddCrmCompanyServiceTypeComponent } from './crm-company-service-type/add-crm-company-service-type/add-crm-company-service-type.component';
import { AddCrmCompanyJobTitleComponent } from './crm-company-job-title/add-crm-company-job-title/add-crm-company-job-title.component';
import { AddCrmCompanyJobTypeComponent } from './crm-company-job-type/add-crm-company-job-type/add-crm-company-job-type.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';



@NgModule({
    declarations: [
        CrmSettingsComponent,
        CrmCompanyIndustryComponent,
        CrmCompanyServiceTypeComponent,
        CrmCompanyJobTitleComponent,
        CrmCompanyJobTypeComponent,
        AddCrmCompanyIndustryComponent,
        AddCrmCompanyServiceTypeComponent,
        AddCrmCompanyJobTitleComponent,
        AddCrmCompanyJobTypeComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        CrmSettingsRoutingModule,
        ClickOutsideModule,
        FormsModule,
        MatFormFieldModule,
        DynamicTooltipModule,
        KeyUpEnterModule
    ],



})
export class CrmSettingsModule { }
