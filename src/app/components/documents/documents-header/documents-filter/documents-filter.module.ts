import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsModule } from 'src/app/components/companies/company-tags/company-tags.module';
import { TechUsersListReportModule } from 'src/app/components/reports/report-menu/tech-users-list-report/tech-users-list-report.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { DocumentsFilterComponent } from './documents-filter.component';

@NgModule({
    declarations: [DocumentsFilterComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        CompanyTagsModule,
        TechUsersListReportModule,
        MultiDatepickerModule,
        CompanyDropDownModule
    ],
    exports: [DocumentsFilterComponent]


})
export class DocumentsFilterModule { }
