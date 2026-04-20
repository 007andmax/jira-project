import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAsideComponent } from './users-aside.component';
import { FormsModule } from '@angular/forms';





import { UserDefaultSubscriptionComponent } from './user-default-subscription/user-default-subscription.component';
import { UserCustomSubscriptionComponent } from './user-custom-subscription/user-custom-subscription.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';





@NgModule({
    declarations: [UsersAsideComponent,

    ],
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxMaskModule.forRoot()
],
    exports: [UsersAsideComponent]


})
export class UsersAsideModule { }
