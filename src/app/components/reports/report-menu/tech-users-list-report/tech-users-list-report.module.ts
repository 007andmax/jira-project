import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechUsersListReportComponent } from './tech-users-list-report.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';



@NgModule({
    declarations: [TechUsersListReportComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,

    ],
    exports: [TechUsersListReportComponent]



})
export class TechUsersListReportModule { }
