import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { DisabledBtnDirective } from './disabled-btn.directive';

@NgModule({
    declarations: [
        DisabledBtnDirective
    ],
    imports: [
        CommonModule,

        FormsModule,
        NgbModule,
    ],
    exports: [DisabledBtnDirective],


})
export class DisabledBtnModule { }
