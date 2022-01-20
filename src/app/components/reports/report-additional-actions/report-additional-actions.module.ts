import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportAdditionalActionsComponent } from './report-additional-actions.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
    declarations: [ReportAdditionalActionsComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        NgbModule,
    ],
    exports: [ReportAdditionalActionsComponent]
})
export class ReportAdditionalActionsModule { }
