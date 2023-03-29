import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';
import { DashboardRoutingOldModule } from './dashboard-routing.module';


@NgModule({
    declarations: [DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxUploaderModule,
        DashboardRoutingOldModule
    ],
})
export class DashboardOldModule { }
