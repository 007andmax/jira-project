import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file-explorer.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { FileRoutingModule } from './file-explorer-routing.module';

@NgModule({
    declarations: [FileComponent
    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        FileRoutingModule
    ],


})
export class FileModule { }
