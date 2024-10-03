import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyAssociateComponent } from './company-associate.component';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';

@NgModule({
    declarations: [CompanyAssociateComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule
    ],
    exports: [CompanyAssociateComponent]



})
export class CompanyAssociateModule { }
