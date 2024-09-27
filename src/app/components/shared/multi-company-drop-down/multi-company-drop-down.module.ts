import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiCompanyDropDownComponent } from './multi-company-drop-down.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';
@NgModule({
    declarations: [
        MultiCompanyDropDownComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        MatIconModule
    ],
    exports: [MultiCompanyDropDownComponent],
})
export class MultiCompanyDropDownModule { }
