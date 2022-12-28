import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportListItemComponent } from './report-list-item.component';


@NgModule({
    declarations: [ReportListItemComponent,
    ],
    imports: [
        CommonModule,

    ],
    exports: [ReportListItemComponent]
})
export class ReportListItemModule { }
