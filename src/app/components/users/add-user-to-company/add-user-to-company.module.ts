import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserToCompanyComponent } from './add-user-to-company.component';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AddUserToCompanyItemComponent } from './add-user-to-company-item/add-user-to-company-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserToCompanySelectedItemComponent } from './add-user-to-company-selected-item/add-user-to-company-selected-item.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [AddUserToCompanyComponent,
        AddUserToCompanyItemComponent,
        AddUserToCompanySelectedItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        InfiniteScrollModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],
    exports: [AddUserToCompanyComponent]
})
export class AddUserToCompanyModule { }
