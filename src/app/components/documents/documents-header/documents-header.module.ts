import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsHeaderComponent } from './documents-header.component';
import { DocumentsFilterComponent } from './documents-filter/documents-filter.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { TechUsersListReportModule } from '../../reports/report-menu/tech-users-list-report/tech-users-list-report.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';

@NgModule({
    declarations: [DocumentsHeaderComponent,
        DocumentsFilterComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        CompanyTagsModule,
        TechUsersListReportModule,
        MultiDatepickerModule,
        CompanyDropDownModule
    ],
    exports: [DocumentsHeaderComponent]


})
export class DocumentsHeaderModule { }
