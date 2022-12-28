import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartupComponent } from './startup-programes.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { StartupRoutingModule } from './startup-programes-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartUpProgramPipe } from 'src/app/pipe/startup-program.pipe';

@NgModule({
    declarations: [StartupComponent,
        StartUpProgramPipe
    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        StartupRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],


})
export class StartupModule { }
