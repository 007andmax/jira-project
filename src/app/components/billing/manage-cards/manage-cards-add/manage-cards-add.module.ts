import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { ManageCardsAddComponent } from './manage-cards-add.component';




@NgModule({
    declarations: [ManageCardsAddComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        CompanyDropDownModule,
        DropDownModule,
        MatErrorModule,
        ReactiveFormsModule
    ],
    exports: [ManageCardsAddComponent]


})
export class ManageCardsAddModule { }
