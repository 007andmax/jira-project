import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserToCompanyComponent } from './add-user-to-company.component';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AddUserToCompanyItemComponent } from './add-user-to-company-item/add-user-to-company-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [AddUserToCompanyComponent,
        AddUserToCompanyItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        InfiniteScrollModule,
        NgbModule

    ],
    entryComponents: [AddUserToCompanyComponent],
    exports: [AddUserToCompanyComponent]


})
export class AddUserToCompanyModule { }
