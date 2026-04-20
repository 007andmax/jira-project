import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [UsersDetailsLeftPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
],
  exports: [UsersDetailsLeftPanelComponent]
})
export class UsersDetailsLeftPanelModule { }
