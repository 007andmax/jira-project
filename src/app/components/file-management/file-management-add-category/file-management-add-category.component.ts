import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { TaxesService } from 'src/app/services/taxes/taxes.service';
import { FileManagementCategory } from '../class/file-management-category';

@Component({
  selector: 'app-file-management-add-category',
  templateUrl: './file-management-add-category.component.html',
  styleUrls: ['./file-management-add-category.component.scss']
})
export class FileManagementAddCategoryComponent implements OnInit {
  @Input() categoryId: string;
  categoryForm: FormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  constructor(private fileManagementService: FileManagementService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      parentCategoryId: [null]
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
    this.fileManagementService
      .addCategory(this.categoryForm.value)
      .pipe(
        map((res: any) => {
          this.onClose.emit();
        })
      )
      .subscribe();
  }
  closed() {
    this.onClose.emit();
  }

}
