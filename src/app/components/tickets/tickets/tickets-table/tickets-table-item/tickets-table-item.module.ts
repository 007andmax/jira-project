import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsTableItemComponent } from './tickets-table-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [TicketsTableItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    exports: [TicketsTableItemComponent]


})
export class TicketsTableItemModule { }
