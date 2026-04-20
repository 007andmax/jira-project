import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';








@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgxUploaderModule,
    NgbModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    DashboardComponent
],
})
export class DashboardModule { }
