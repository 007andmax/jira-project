import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { CompanyDropDownComponent } from './company-drop-down.component';
@NgModule({
    declarations: [
        CompanyDropDownComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,
    ],
    exports: [CompanyDropDownComponent],


})
export class CompanyDropDownModule { }
