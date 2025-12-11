import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageCardsRoutingModule } from './manage-cards-routing.module';
import { ManageCardsComponent } from './manage-cards.component';
import { ManageCardsHeaderComponent } from './manage-cards-header/manage-cards-header.component';
import { ManageCardsAddComponent } from './manage-cards-add/manage-cards-add.component';
import { R } from '@angular/cdk/keycodes';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { ManageCardsTableComponent } from './manage-cards-table/manage-cards-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageCardsEditComponent } from './manage-cards-edit/manage-cards-edit.component';




@NgModule({
    declarations: [ManageCardsComponent, ManageCardsHeaderComponent, ManageCardsAddComponent, ManageCardsTableComponent, ManageCardsEditComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        ManageCardsRoutingModule,
        DropDownModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatErrorModule,
        ReactiveFormsModule,
        CompanyDropDownModule,
        InfiniteScrollModule,
        NgbModule
    ],

})
export class ManageCardsModule { }
