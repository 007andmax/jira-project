import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDetailsHeaderComponent } from './users-details-header.component';

@NgModule({
  declarations: [UsersDetailsHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [UsersDetailsHeaderComponent]
})
export class UsersDetailsHeaderModule { }
