import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiDatepickerComponent } from './multi-datepicker.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { MatErrorModule } from '../mat-error/mat-error.module';


@NgModule({
    declarations: [MultiDatepickerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ClickOutsideModule,
        MatErrorModule
    ],
    exports: [MultiDatepickerComponent]


})
export class MultiDatepickerModule { }
