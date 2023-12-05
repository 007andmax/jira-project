import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsTableItemComponent } from './tickets-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [TicketsTableItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
    ],
    exports: [TicketsTableItemComponent]


})
export class TicketsTableItemModule { }
