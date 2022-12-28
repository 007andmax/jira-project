import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { ProcessesComponent } from './processes.component';
import { ProcessesRoutingModule } from './processes-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessesPipe } from 'src/app/pipe/processes.pipe';

@NgModule({
    declarations: [ProcessesComponent,
        ProcessesPipe
    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        ProcessesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],


})
export class ProcessesModule { }
