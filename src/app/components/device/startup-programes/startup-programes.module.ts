import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartupComponent } from './startup-programes.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { StartupRoutingModule } from './startup-programes-routing.module';

@NgModule({
    declarations: [StartupComponent
    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        StartupRoutingModule
    ],


})
export class StartupModule { }
