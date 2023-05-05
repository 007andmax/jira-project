import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartupComponent } from './startup-programes.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';

@NgModule({
    declarations: [StartupComponent,

    ],
    imports: [
        CommonModule,
        TicketTaskModule
    ],
})
export class StartupOldModule { }
