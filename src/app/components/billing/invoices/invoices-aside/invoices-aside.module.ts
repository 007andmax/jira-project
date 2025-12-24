import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesAsideComponent } from './invoices-aside.component';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiCompanyDropDownModule } from 'src/app/components/shared/multi-company-drop-down/multi-company-drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { PaymentsCardsComponent } from '../../payments/payments-cards/payments-cards.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageCardsAddModule } from '../../manage-cards/manage-cards-add/manage-cards-add.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
        declarations: [InvoicesAsideComponent,
                PaymentsCardsComponent

        ],
        imports: [
                CommonModule,
                DatePickerModule,
                NumberModule,
                FormsModule,
                DisabledBtnModule,
                PreloaderTicketModule,
                CompanyDropDownModule,
                DropDownModule,
                MultiCompanyDropDownModule,
                MatErrorModule,
                NgbModule,
                InfiniteScrollModule
        ],
        exports: [InvoicesAsideComponent]


})
export class InvoicesAsideModule { }
