import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersAsideDetailTicketsItemComponent } from './users-aside-detail-tickets-item.component';

@NgModule({
    declarations: [UsersAsideDetailTicketsItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,

    ],
    exports: [UsersAsideDetailTicketsItemComponent]

})
export class UsersAsideDetailTicketsItemModule { }
