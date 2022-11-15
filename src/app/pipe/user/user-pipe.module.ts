import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPipe } from './user.pipe';


@NgModule({
    declarations: [
        UserPipe
    ],
    imports: [
        CommonModule,


    ],
    exports: [UserPipe],


})
export class UserPipeModule { }
