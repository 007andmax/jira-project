import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordManagerTableComponent } from './password-manager-table.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [PasswordManagerTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [PasswordManagerTableComponent]



})
export class PasswordManagerTableModule { }
