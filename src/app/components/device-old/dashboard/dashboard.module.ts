import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';
import { DashboardRoutingOldModule } from './dashboard-routing.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DashboardDetailsDashboardComponent } from './dashboard-details-dashboard/dashboard-details-dashboard.component';


@NgModule({
    declarations: [DashboardComponent, DashboardDetailsDashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxUploaderModule,
        DashboardRoutingOldModule,
        DatePickerModule
    ],
})
export class DashboardOldModule { }
