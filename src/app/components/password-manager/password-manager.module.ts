import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordManagerRoutingModule } from './password-manager-routing.module';
import { PasswordManagerComponent } from './password-manager.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





import { PasswoordManagerDevicesUsersComponent } from './passwoord-manager-devices-users/passwoord-manager-devices-users.component';
import { PasswoordManagerFiltersComponent } from './passwoord-manager-header/passwoord-manager-filters/passwoord-manager-filters.component';
import { PasswoordManagerHeaderComponent } from './passwoord-manager-header/passwoord-manager-header.component';
import { PasswordManagerAddAsideComponent } from './password-manager-add-aside/password-manager-add-aside.component';
import { PasswordManagerLinkedComponent } from './password-manager-add-aside/password-manager-linked/password-manager-linked.component';
import { PasswordManagerAddCategoryComponent } from './password-manager-add-category/password-manager-add-category.component';
import { PasswordManagerEditAsideComponent } from './password-manager-edit-aside/password-manager-edit-aside.component';
import { PasswordManagerEditLinkedComponent } from './password-manager-edit-aside/password-manager-edit-linked/password-manager-edit-linked.component';
import { PasswordManagerTableComponent } from './password-manager-table/password-manager-table.component';









@NgModule({
    imports: [
    CommonModule,
    PasswordManagerRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    NgbModule,
    PasswordManagerComponent
],
    exports: [ //PasswordManagerAddCategoryComponent,
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
