import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { UsersTableCompanyByComponent } from './users-table-company-by.component';

@NgModule({
    declarations: [UsersTableCompanyByComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [UsersTableCompanyByComponent]
})
export class UsersTableCompanyByModule { }
