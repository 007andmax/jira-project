import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordManagerTableComponent } from './password-manager-table.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';


@NgModule({
    declarations: [PasswordManagerTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [PasswordManagerTableComponent]



})
export class PasswordManagerTableModule { }
