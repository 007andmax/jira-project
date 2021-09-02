import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsHeaderComponent } from './documents-header.component';
import { DocumentsFilterComponent } from './documents-filter/documents-filter.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectSearchModule } from '../../shared/select-search/select-search.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { TechUsersListReportModule } from '../../reports/report-menu/tech-users-list-report/tech-users-list-report.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';

@NgModule({
    declarations: [DocumentsHeaderComponent,
        DocumentsFilterComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        SelectSearchModule,
        CompanyTagsModule,
        TechUsersListReportModule,
        MultiDatepickerModule
    ],
    exports: [DocumentsHeaderComponent]


})
export class DocumentsHeaderModule { }
