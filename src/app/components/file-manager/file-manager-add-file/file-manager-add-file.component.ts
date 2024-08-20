import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileManagerAddFile } from './class/file-manager-add-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { DocumentsService } from 'src/app/services/documents/documents.service';

@Component({
  selector: 'app-file-manager-add-file',
  templateUrl: './file-manager-add-file.component.html',
  styleUrls: ['./file-manager-add-file.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class FileManagerAddFileComponent implements OnInit {
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @Input() categoryId: string;
  @Input() companyId: string;
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
      "description": [null, [Validators.minLength(1), Validators.maxLength(1000)]],
      "mediaFileId": ['', [Validators.required]],
      "tags": [[]],
      "companyId": [null],
      "categoryId": [null],
    });
    console.log("rrr", this.f2.name.value.length)
  }
  onChangeTags(data) {
    console.log("ata", data);
    this.addForm.controls["tags"].setValue(data.map(item => ({ id: item.id })));
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
    console.log("onRemoveFile", id);
    this.documentsService.removeDocumentAttachment(id).subscribe(data => {

    })
  }
  onChangeFiles(data) {
    console.log("ids", data);
    this.addForm.controls["mediaFileId"].setValue(data.id);
    this.addForm.controls["name"].setValue(data.name);
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
    if (this.companyId) this.addForm.controls["companyId"].setValue(this.companyId);
    console.log("this.invoiceForm.value", this.addForm.value);
    this.addBtn.setDisabled(true);
    this.fileManagementService.addFile(this.addForm.value).subscribe(data => {
      this.fileManagementStateService.addFile(data);
      this.addBtn.setDisabled(false);
      this.close();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
}
