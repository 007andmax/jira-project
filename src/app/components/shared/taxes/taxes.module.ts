import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxesComponent } from './taxes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TaxesComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule
    ],
    exports: [TaxesComponent]
})
export class TaxesModule { }
