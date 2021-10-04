import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectSearchComponent } from './select-search.component';
@NgModule({
    declarations: [
        SelectSearchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [SelectSearchComponent],


})
export class SelectSearchModule { }
