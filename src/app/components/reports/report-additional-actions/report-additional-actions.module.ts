import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportAdditionalActionsComponent } from './report-additional-actions.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';




@NgModule({
    declarations: [ReportAdditionalActionsComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
    ],
    exports: [ReportAdditionalActionsComponent]



})
export class ReportAdditionalActionsModule { }
