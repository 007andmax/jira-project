import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightClickBlankDirective } from './right-click-blank.directive';


@NgModule({
    declarations: [
        RightClickBlankDirective
    ],
    imports: [
        CommonModule,
    ],
    exports: [RightClickBlankDirective],
})
export class RightClickBlankModule { }
