import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DblclickDirective } from './dblclick.directive';

@NgModule({
    declarations: [
        DblclickDirective
    ],
    imports: [
        CommonModule,
        FormsModule,

    ],
    exports: [DblclickDirective],


})
export class DblclickModule { }
