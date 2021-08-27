import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TehUsersComponent } from './teh-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [TehUsersComponent
    ],
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [TehUsersComponent]



})
export class TehUsersModule { }
