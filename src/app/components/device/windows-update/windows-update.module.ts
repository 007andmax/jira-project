import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowsComponent } from './windows-update.component';
import { TicketTaskModule } from '../ticket-task/ticket-task.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WindowsRoutingModule } from './windows-update-routing.module';


@NgModule({
    declarations: [WindowsComponent
    ],
    imports: [
        CommonModule,
        TicketTaskModule,
        NgbModule,
        WindowsRoutingModule
    ],



})
export class WindowsModule { }
