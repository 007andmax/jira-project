import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanelSuperAdminComponent } from './left-panel-super-admin.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
    declarations: [LeftPanelSuperAdminComponent
    ],
    imports: [
        CommonModule,
        DynamicTooltipModule,
        NgbModule,
    ],
    exports: [LeftPanelSuperAdminComponent]
})
export class LeftPanelSuperAdminModule { }
