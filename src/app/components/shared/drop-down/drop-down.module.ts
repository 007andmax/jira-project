import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownComponent } from './drop-down.component';
import { AppComponent } from 'src/app/app.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { MatErrorModule } from '../mat-error/mat-error.module';
@NgModule({
    declarations: [
        DropDownComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [DropDownComponent],


})
export class DropDownModule { }
