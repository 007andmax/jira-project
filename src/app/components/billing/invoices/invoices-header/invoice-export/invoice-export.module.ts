import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { InvoiceExportComponent } from './invoice-export.component';



@NgModule({
    declarations: [InvoiceExportComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [InvoiceExportComponent]


})
export class InvoiceExportModule { }
