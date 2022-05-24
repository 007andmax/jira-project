import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragMenuDirective } from './drag-menu.directive';


@NgModule({
    declarations: [
        DragMenuDirective
    ],
    imports: [
        CommonModule,
    ],
    exports: [DragMenuDirective],
})
export class DragMenuModule { }
