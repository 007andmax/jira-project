import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { DateFormatModule } from 'src/app/pipe/dateFormat/date-format.module';
import { DeviceRoutingModule } from './device-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';


@NgModule({
    declarations: [DeviceComponent,
        NavComponent,
        // DashboardComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        DateFormatModule,
        DeviceRoutingModule,

        // DashboardModule
    ],

})
export class DeviceModule { }
