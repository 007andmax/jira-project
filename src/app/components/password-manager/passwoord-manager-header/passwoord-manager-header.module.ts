import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswoordManagerHeaderComponent } from './passwoord-manager-header.component';
import { FormsModule } from '@angular/forms';
import { PasswoordManagerFiltersComponent } from './passwoord-manager-filters/passwoord-manager-filters.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { PasswordManagerAddCategoryComponent } from '../password-manager-add-category/password-manager-add-category.component';
import { PasswoordManagerDevicesUsersComponent } from '../passwoord-manager-devices-users/passwoord-manager-devices-users.component';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PasswordManagerAddCategoryModule } from '../password-manager-add-category/password-manager-add-category.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';

@NgModule({
    declarations: [PasswoordManagerHeaderComponent,
        PasswoordManagerFiltersComponent,
        PasswoordManagerDevicesUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,
        PasswordManagerAddCategoryModule,
        MatIconModule,
        CompanyDropDownModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule
    ],
    exports: [PasswoordManagerHeaderComponent]
})
export class PasswoordManagerHeaderModule { }
