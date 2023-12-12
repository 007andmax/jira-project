import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsComponent } from './dashboard-stats.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [DashboardStatsComponent,

    ],
    imports: [
        CommonModule,
        NgbModule,

    ],
    exports: [DashboardStatsComponent]



})
export class DashboardStatsModule { }
