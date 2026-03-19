import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketsTableItemRequestedByComponent } from './tickets-table-item-requested-by.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [TicketsTableItemRequestedByComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [TicketsTableItemRequestedByComponent]
})
export class TicketsTableItemRequestedByModule { }
