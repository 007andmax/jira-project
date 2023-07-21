import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownComponent } from './drop-down.component';
import { AppComponent } from 'src/app/app.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
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
    ],
    exports: [DropDownComponent],


})
export class DropDownModule { }
