import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiDatepickerComponent } from './multi-datepicker.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
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
