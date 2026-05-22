import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { TicketsTableItemStatusComponent } from './tickets-table-item-status.component';

@NgModule({
    declarations: [TicketsTableItemStatusComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [TicketsTableItemStatusComponent]
})
export class TicketsTableItemStatusModule { }
