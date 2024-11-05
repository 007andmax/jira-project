import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersDetailsTabPasswordsItemComponent } from './users-details-tab-passwords-item/users-details-tab-passwords-item.component';
import { UsersDetailsTabPasswordsComponent } from './users-details-tab-passwords.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [UsersDetailsTabPasswordsComponent,
    UsersDetailsTabPasswordsItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule
  ],
  exports: [UsersDetailsTabPasswordsComponent]
})
export class UsersDetailsTabPasswordsModule { }
