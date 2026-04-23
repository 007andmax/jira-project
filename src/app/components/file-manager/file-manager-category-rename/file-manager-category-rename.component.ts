import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagerCategory } from '../class/file-manager-category';
import { map } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-file-manager-category-rename',
  templateUrl: './file-manager-category-rename.component.html',
  styleUrls: ['./file-manager-category-rename.component.scss'],

})
export class FileManagerCategoryRenameComponent implements OnInit {
  @Input() item: FileManagerCategory;
  categoryForm: UntypedFormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  constructor(private fileManagementService: FileManagementService,
    private formBuilder: UntypedFormBuilder,
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
