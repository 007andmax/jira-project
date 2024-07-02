import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './click-otside.directive';

@NgModule({
    declarations: [
        ClickOutsideDirective
    ],
    imports: [
        CommonModule,
        FormsModule,

    ],
    exports: [ClickOutsideDirective],


})
export class ClickOutsideModule { }
