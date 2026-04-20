import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-file-manager-add-category',
    templateUrl: './file-manager-add-category.component.html',
    styleUrls: ['./file-manager-add-category.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf]
})
export class FileManagerAddCategoryComponent implements OnInit {
  @Input() categoryId: string;
  @Input() companyId: string;
  categoryForm: UntypedFormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  constructor(private fileManagementService: FileManagementService,
    private fileManagementStateService: FileManagementStateService,
    private formBuilder: UntypedFormBuilder,) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      parentCategoryId: [null],
      companyId: [null]
    });
  }
  get f() {
    return this.categoryForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.categoryForm.invalid) {
      return;
    }
    if (this.categoryId) this.categoryForm.controls["parentCategoryId"].setValue(this.categoryId);
    if (this.companyId) this.categoryForm.controls["companyId"].setValue(this.companyId);
    this.fileManagementService
      .addCategory(this.categoryForm.value)
      .subscribe(data => {
        this.fileManagementStateService.addCategory(data);
        this.onClose.emit();
      });
  }
  closed() {
    this.onClose.emit();
  }

}
