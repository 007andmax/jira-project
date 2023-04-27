import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowsComponent } from './windows-update.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [WindowsComponent,

    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule,
        NgbModule
    ],
})
export class WindowsOldModule { }
