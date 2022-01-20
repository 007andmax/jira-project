import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersListReportComponent } from './tech-users-list-report.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
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
