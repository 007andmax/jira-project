import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiDatepickerComponent } from './multi-datepicker.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [MultiDatepickerComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,

    ],
    exports: [MultiDatepickerComponent]


})
export class MultiDatepickerModule { }
