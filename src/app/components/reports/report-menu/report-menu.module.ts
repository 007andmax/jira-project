import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportMenuComponent } from './report-menu.component';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { TechUsersListReportModule } from './tech-users-list-report/tech-users-list-report.module';
import { SoftwareSummaryDevicesDroDownComponent } from '../reports/software-summary-report/software-summary-devices-dro-down/software-summary-devices-dro-down.component';
import { FormsModule } from '@angular/forms';
import { ProductListModule } from '../../shared/product-list/product-list.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule, MatChipsModule } from '@angular/material';




@NgModule({
    declarations: [ReportMenuComponent,
        SoftwareSummaryDevicesDroDownComponent
    ],
    imports: [
        CommonModule,
        MultiDatepickerModule,
        DropDownModule,
        TechUsersListReportModule,
        FormsModule,
        ProductListModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
    ],
    exports: [ReportMenuComponent]



})
export class ReportMenuModule { }
