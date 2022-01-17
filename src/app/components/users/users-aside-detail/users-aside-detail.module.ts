import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersAsideDetailComponent } from './users-aside-detail.component';

@NgModule({
    declarations: [UsersAsideDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,

    ],
    exports: [UsersAsideDetailComponent]

})
export class UsersAsideDetailModule { }
