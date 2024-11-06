import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDetailsHeaderComponent } from './users-details-header.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';

@NgModule({
  declarations: [UsersDetailsHeaderComponent],
  imports: [
    CommonModule,
    DisabledBtnModule,
    PreloaderTicketModule
  ],
  exports: [UsersDetailsHeaderComponent]
})
export class UsersDetailsHeaderModule { }
