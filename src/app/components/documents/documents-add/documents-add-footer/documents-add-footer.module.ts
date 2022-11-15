import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddFooterComponent } from './documents-add-footer.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';



@NgModule({
    declarations: [DocumentsAddFooterComponent,


    ],
    imports: [
        CommonModule,
        DynamicTooltipModule,
        DisabledBtnModule,
        PreloaderTicketModule


    ],
    exports: [DocumentsAddFooterComponent]


})
export class DocumentsAddFooterModule { }
