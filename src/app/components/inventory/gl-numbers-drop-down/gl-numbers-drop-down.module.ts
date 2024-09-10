import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { GlNumbersDropDownComponent } from './gl-numbers-drop-down.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';


@NgModule({
    declarations: [GlNumbersDropDownComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [GlNumbersDropDownComponent]
})
export class GlNumbersDropDownModule { }
