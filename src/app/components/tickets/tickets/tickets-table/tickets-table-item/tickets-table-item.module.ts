import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsTableItemComponent } from './tickets-table-item.component';

@NgModule({
    declarations: [TicketsTableItemComponent
    ],
    imports: [
        CommonModule,

    ],
    exports: [TicketsTableItemComponent]


})
export class TicketsTableItemModule { }
