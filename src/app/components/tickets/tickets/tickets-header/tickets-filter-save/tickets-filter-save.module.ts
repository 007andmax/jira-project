import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsFilterSaveComponent } from './tickets-filter-save.component';
import { FormsModule } from '@angular/forms';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MatSelectModule, MatChipsModule } from '@angular/material';

@NgModule({
    declarations: [
        TicketsFilterSaveComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatSelectModule,
        MatChipsModule,

    ],
    exports: [TicketsFilterSaveComponent],
    entryComponents: [TicketsFilterSaveComponent]


})
export class TicketsFilterSaveModule { }
