import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownComponent } from './drop-down.component';
import { AppComponent } from 'src/app/app.component';
import { MatErrorModule } from '../mat-error/mat-error.module';
@NgModule({
    declarations: [
        DropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [DropDownComponent],


})
export class DropDownModule { }
