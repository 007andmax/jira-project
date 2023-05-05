import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareComponent } from './software.component';
import { SoftwareRoutingOldModule } from './software-routing.module';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { SoftwarePipe } from '../_pipe/software.pipe';
import { SoftwareHeaderComponent } from './software-header/software-header.component';



@NgModule({
    declarations: [SoftwareComponent,
        SoftwarePipe,
        SoftwareHeaderComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        DataTablesModule,
        SoftwareRoutingOldModule,
        TicketTaskModule
    ],



})
export class SoftwareOldModule { }
