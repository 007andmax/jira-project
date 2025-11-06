import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { PasswordManagerAddCategoryModule } from '../../password-manager-add-category/password-manager-add-category.module';
import { PasswoordManagerFiltersComponent } from './passwoord-manager-filters.component';
import { PasswoordManagerDevicesUsersComponent } from '../../passwoord-manager-devices-users/passwoord-manager-devices-users.component';

@NgModule({
    declarations: [PasswoordManagerFiltersComponent,
        PasswoordManagerDevicesUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        PasswordManagerAddCategoryModule,
        CompanyDropDownModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule
    ],
    exports: [PasswoordManagerFiltersComponent]
})
export class PasswoordManagerFiltersModule { }
