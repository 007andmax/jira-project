import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MergeTicketsComponent } from './merge-tickets.component';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { MergeTicketsItemComponent } from './merge-tickets-item/merge-tickets-item.component';
import { MergeTicketsEditItemComponent } from './merge-tickets-edit-item/merge-tickets-edit-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [MergeTicketsComponent, MergeTicketsItemComponent, MergeTicketsEditItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule
    ],
    exports: [MergeTicketsComponent]
})
export class MergeTicketsModule { }
