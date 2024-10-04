import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddEditCategoriesComponent } from './documents-add-edit-categories.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';


@NgModule({
    declarations: [DocumentsAddEditCategoriesComponent

    ],
    imports: [
        CommonModule,
        DynamicTooltipModule,
        FormsModule,
        MatErrorModule
    ],
    exports: [DocumentsAddEditCategoriesComponent]



})
export class DocumentsAddEditCategoriesModule { }
