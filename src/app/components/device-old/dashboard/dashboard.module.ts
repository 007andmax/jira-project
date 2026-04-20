import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';
import { DashboardRoutingOldModule } from './dashboard-routing.module';

import { DashboardDetailsDashboardComponent } from './dashboard-details-dashboard/dashboard-details-dashboard.component';
import { DashboardDiskDrivesComponent } from './dashboard-disk-drives/dashboard-disk-drives.component';
import { DashboardServicesComponent } from './dashboard-services/dashboard-services.component';
import { DashboardTagsComponent } from './dashboard-tags/dashboard-tags.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxUploaderModule,
    DashboardRoutingOldModule,
    DashboardComponent, DashboardDetailsDashboardComponent, DashboardDiskDrivesComponent, DashboardServicesComponent, DashboardTagsComponent,
],
})
export class DashboardOldModule { }
