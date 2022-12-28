import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';




@NgModule({
    declarations: [DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxUploaderModule,
        NgbModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        TicketTaskModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
    ],
})
export class DashboardModule { }
