import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersHeaderComponent } from './users-header.component';
import { UsersFilterComponent } from './users-filter/users-filter.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';



@NgModule({
    declarations: [
        UsersHeaderComponent,
        UsersFilterComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
    ],
    exports: [UsersHeaderComponent]



})
export class UsersHeaderModule { }
