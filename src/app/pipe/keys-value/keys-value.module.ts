import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysValuePipe } from './keys-value.pipe';

@NgModule({
    declarations: [
        KeysValuePipe
    ],
    imports: [
        CommonModule,


    ],
    exports: [KeysValuePipe],


})
export class KeysValueModule { }
