import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyAddAsideComponent } from './company-add-aside.component';
import { CompanyAddAsideShortComponent } from './company-add-aside-short/company-add-aside-short.component';
import { CompanyAddAsideFullComponent } from './company-add-aside-full/company-add-aside-full.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanySubscriptionModule } from '../company-subscription/company-subscription.module';
import { CompanyTimeZoneModule } from '../company-time-zone/company-time-zone.module';
import { CompanyTagsModule } from '../company-tags/company-tags.module';
import { CompanyAssociateModule } from '../../company-dashboard/company-dash-associate/company-associate/company-associate.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { UserDefaultSubscriptionModule } from '../../users/users-aside/user-default-subscription/user-default-subscription.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';



@NgModule({
    declarations: [CompanyAddAsideComponent,
        CompanyAddAsideShortComponent,
        CompanyAddAsideFullComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTimeZoneModule,
        CompanyTagsModule,
        CompanyAssociateModule,
        TextAreaModule,
        NgbModule,
        NgxMaskModule.forRoot(),
        UserDefaultSubscriptionModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],
    exports: [CompanyAddAsideComponent]



})
export class CompanyAddAsideModule { }
