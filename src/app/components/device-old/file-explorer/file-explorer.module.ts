import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file-explorer.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';


@NgModule({
    declarations: [FileComponent,

    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule,
    ],
})
export class FileOldModule { }
