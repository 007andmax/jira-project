import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiCompanyDropDownComponent } from './multi-company-drop-down.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';
import { MatChipModule } from '../mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../mat-form-field/mat-form-field.module';
import { MatChipListModule } from '../mat-chip-list/mat-chip-list.module';


@NgModule({
    declarations: [
        MultiCompanyDropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
    exports: [MultiCompanyDropDownComponent],
})
export class MultiCompanyDropDownModule { }
