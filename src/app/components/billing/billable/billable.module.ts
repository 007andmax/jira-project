import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableComponent } from './billable.component';
import { BillableItemComponent } from './billable-item/billable-item.component';
import { BillableRoutingModule } from './billable-routing.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [BillableComponent,
        BillableItemComponent
    ],
    imports: [
        CommonModule,
        BillableRoutingModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        FormsModule,
        NgbModule,
    ],



})
export class BillableModule { }
