import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerAddCategoryComponent } from './file-manager-add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FileManagerAddCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FileManagerAddCategoryComponent]
})
export class FileManagerAddCategoryModule { }
