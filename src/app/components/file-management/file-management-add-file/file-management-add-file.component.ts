import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileManagementAddFile } from './class/file-management-add-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { DocumentsService } from 'src/app/services/documents/documents.service';

@Component({
  selector: 'app-file-management-add-file',
  templateUrl: './file-management-add-file.component.html',
  styleUrls: ['./file-management-add-file.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class FileManagementAddFileComponent implements OnInit {
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @Input() categoryId: string;
  addForm: FormGroup;
  submitted = false;
  files: any[] = [];
  constructor(public cd: ChangeDetectorRef,
    private fileManagementService: FileManagementService,
    private fileManagementStateService: FileManagementStateService,
    private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private documentsService: DocumentsService,
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      "name": ["", [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      "description": ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
      "mediaFileId": ['', [Validators.required]],
      "tags": [[]],
      "companyId": [null],
      "categoryId": [null],
    });
  }
  onChangeTags(data) {
    console.log("ata", data);
    this.addForm.controls["tags"].setValue(data.map(item => item.id));
  }
  onUploadingFile(data) {
    this.addBtn.setDisabled(data);
  }
  close() {
    console.log("close");
    console.log(this.addForm.controls["mediaFileId"].value);
    if (!this.submitted && this.addForm.controls["mediaFileId"].value) this.onRemoveFile(this.addForm.controls["mediaFileId"].value);
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  }
  onRemoveFile(id) {
    this.documentsService.removeDocumentAttachment(id).subscribe(data => {

    })
  }
  onChangeFiles(ids) {
    console.log("ids", ids);
    this.addForm.controls["mediaFileId"].setValue(ids[0]);
  }
  get f2() {
    return this.addForm.controls;
  }
  onSend() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    this.addForm.controls["categoryId"].setValue(this.categoryId);
    console.log("this.invoiceForm.value", this.addForm.value);
    this.addBtn.setDisabled(true);
    this.fileManagementService.addFile(this.addForm.value).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
}
