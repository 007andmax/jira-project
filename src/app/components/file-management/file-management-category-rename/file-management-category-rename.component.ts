import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementCategory } from '../class/file-management-category';
import { map } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-management-category-rename',
  templateUrl: './file-management-category-rename.component.html',
  styleUrls: ['./file-management-category-rename.component.scss']
})
export class FileManagementCategoryRenameComponent implements OnInit {
  @Input() item: FileManagementCategory;
  categoryForm: FormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  constructor(private fileManagementService: FileManagementService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: [
        this.item.name,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
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

    this.fileManagementService
      .editCategory(this.item.id, this.categoryForm.value)
      .pipe(
        map((res: any) => {
          this.closed();
        })
      )
      .subscribe();
  }
  closed() {
    this.activeModal.close();
  }
}
