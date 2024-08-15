import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
import { TicketsPermissionsService } from '../../tickets/tickets/ticket-edit-aside/services/tickets-permissions.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';

@Component({
  selector: 'app-file-management-file-info',
  templateUrl: './file-management-file-info.component.html',
  styleUrls: ['./file-management-file-info.component.scss'],

})
export class FileManagementFileInfoComponent implements OnInit, OnDestroy {
  selectedTags: Array<any> = [];
  @Input() file: FileManagementFile;
  @Input() category: FileManagementCategory;
  modelForm: FormGroup;
  submitted: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private fileManagementService: FileManagementService,
    private tagsState: TagsStateService,
    public formBuilder: FormBuilder,
    public previewFileStateService: PreviewFileStateService,
    public fileManagementStateService: FileManagementStateService,
  ) { }

  ngOnInit() {
    console.log("this.file", this.file);
    if (this.file) this.selectedTags = JSON.parse(JSON.stringify(this.file.tags));
    this.modelForm = this.formBuilder.group({
      name: [
        this.file && this.file.name || this.category && this.category.name,
        [Validators.required, Validators.min(1), this.file ? Validators.max(100) : Validators.max(50)]
      ],
    })
  }
  get f2() {
    return this.modelForm.controls;
  }

  isImage() {
    return this.file && (this.file.contentType === "image/jpg" || this.file.contentType === "image/png" || this.file.contentType === "image/jpeg");
  }
  onChangeTags(data) {
    console.log("data", data);
    this.file.setTags(data);
    this.selectedTags = data;
    if (this.file) {
      this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(res => {
        this.fileManagementStateService.editFile(res);
      })
    }
  }
  onChange() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      console.log("this.modelForm", this.modelForm);
      return;
    }
    if (this.file) {
      this.file.setName(this.modelForm.value.name);
      this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(res => {
        this.fileManagementStateService.editFile(res);
      })
    }
    if (this.category) {
      this.category.setName(this.modelForm.value.name);
      this.fileManagementService.editCategory(this.category.id, this.category.getDataForUpate()).subscribe(res => {
        this.fileManagementStateService.editCategory(res);
      })
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  preview() {
    if (this.file.contentType === "image/jpg" || this.file.contentType === "image/png" || this.file.contentType === "image/jpeg") this.previewFileStateService.initPreview(this.file);

  }
}
