import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { TextAreaDirective } from './text-area.directive';

@NgModule({
    declarations: [
        TextAreaDirective
    ],
    imports: [
        CommonModule,

        FormsModule,
        NgbModule,
    ],
    exports: [TextAreaDirective],


})
export class TextAreaModule { }
