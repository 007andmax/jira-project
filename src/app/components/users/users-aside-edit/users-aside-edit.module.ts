import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAsideEditComponent } from './users-aside-edit.component';
import { FormsModule } from '@angular/forms';






import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';






@NgModule({
    declarations: [UsersAsideEditComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxMaskModule.forRoot()
],
    exports: [UsersAsideEditComponent]

})
export class UsersAsideEditModule { }
