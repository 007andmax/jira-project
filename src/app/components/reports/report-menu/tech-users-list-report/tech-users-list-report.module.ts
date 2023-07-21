import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersListReportComponent } from './tech-users-list-report.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [TechUsersListReportComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,

    ],
    exports: [TechUsersListReportComponent]



})
export class TechUsersListReportModule { }
