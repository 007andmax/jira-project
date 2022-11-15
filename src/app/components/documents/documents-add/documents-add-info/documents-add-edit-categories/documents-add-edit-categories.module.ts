import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsAddEditCategoriesComponent } from './documents-add-edit-categories.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [DocumentsAddEditCategoriesComponent

    ],
    imports: [
        CommonModule,
        DynamicTooltipModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,

    ],
    exports: [DocumentsAddEditCategoriesComponent]



})
export class DocumentsAddEditCategoriesModule { }
