import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { CompanyDropDownComponent } from './company-drop-down.component';
import { MatErrorModule } from '../mat-error/mat-error.module';
@NgModule({
    declarations: [
        CompanyDropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [CompanyDropDownComponent],


})
export class CompanyDropDownModule { }
