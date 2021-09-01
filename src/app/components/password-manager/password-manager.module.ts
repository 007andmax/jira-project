import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordManagerRoutingModule } from './password-manager-routing.module';
import { PasswordManagerComponent } from './password-manager.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PasswoordManagerDevicesUsersComponent } from './passwoord-manager-devices-users/passwoord-manager-devices-users.component';
import { PasswoordManagerFiltersComponent } from './passwoord-manager-header/passwoord-manager-filters/passwoord-manager-filters.component';
import { PasswoordManagerHeaderComponent } from './passwoord-manager-header/passwoord-manager-header.component';
import { PasswordManagerAddAsideComponent } from './password-manager-add-aside/password-manager-add-aside.component';
import { PasswordManagerLinkedComponent } from './password-manager-add-aside/password-manager-linked/password-manager-linked.component';
import { PasswordManagerAddCategoryComponent } from './password-manager-add-category/password-manager-add-category.component';
import { PasswordManagerEditAsideComponent } from './password-manager-edit-aside/password-manager-edit-aside.component';
import { PasswordManagerEditLinkedComponent } from './password-manager-edit-aside/password-manager-edit-linked/password-manager-edit-linked.component';
import { PasswordManagerTableComponent } from './password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderModule } from './passwoord-manager-header/passwoord-manager-header.module';
import { PasswordManagerTableModule } from './password-manager-table/password-manager-table.module';
import { PasswordManagerEditAsideModule } from './password-manager-edit-aside/password-manager-edit-aside.module';
import { PasswordManagerAddAsideModule } from './password-manager-add-aside/password-manager-add-aside.module';

@NgModule({
    declarations: [PasswordManagerComponent,
        // PasswordManagerAddCategoryComponent,
        //  PasswoordManagerDevicesUsersComponent,
        //  PasswoordManagerFiltersComponent,
        // PasswoordManagerHeaderComponent,
        // PasswordManagerTableComponent,
        //   PasswordManagerEditAsideComponent,
        //  PasswordManagerAddAsideComponent,
        //  PasswordManagerEditLinkedComponent,
        //  PasswordManagerLinkedComponent
    ],
    imports: [
        CommonModule,
        PasswordManagerRoutingModule,
        InfiniteScrollModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        TextAreaModule,
        DatePickerModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        PasswoordManagerHeaderModule,
        PasswordManagerTableModule,
        PasswordManagerEditAsideModule,
        PasswordManagerAddAsideModule
    ],
    exports: [//PasswordManagerAddCategoryComponent,
        //   PasswoordManagerDevicesUsersComponent,
        //   PasswoordManagerFiltersComponent,
        //  PasswoordManagerHeaderComponent,
        //  PasswordManagerTableComponent,
        //  PasswordManagerEditAsideComponent,
        //  PasswordManagerAddAsideComponent,
        //  PasswordManagerEditLinkedComponent,
    ]


})
export class PasswordManagerModule { }
