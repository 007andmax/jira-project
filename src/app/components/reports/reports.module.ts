import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportListItemComponent } from './report-list-item/report-list-item.component';
import { ReportsRoutingModule } from './reports-routing.module';



@NgModule({
    declarations: [ReportsComponent,
        ReportListItemComponent
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule

    ],



})
export class ReportsModule { }
