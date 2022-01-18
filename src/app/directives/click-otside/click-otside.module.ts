import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOtsideDirective } from './click-otside.directive';

@NgModule({
    declarations: [
        ClickOtsideDirective
    ],
    imports: [
        CommonModule,
        FormsModule,

    ],
    exports: [ClickOtsideDirective],


})
export class ClickOtsideModule { }
