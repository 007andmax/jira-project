import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileManagerCategory } from '../class/file-manager-category';
import { FileManagerFile } from '../class/file-manager-file';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { FileManagementRealTimeService } from 'src/app/states/file-management/file-management-real-time.service';
import * as moment from "moment";
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-file-manager-file-info',
  templateUrl: './file-manager-file-info.component.html',
  styleUrls: ['./file-manager-file-info.component.scss'],

})
export class FileManagerFileInfoComponent implements OnInit, OnDestroy {
  selectedTags: Array<any> = [];
  @Input() isEdit: boolean = false;
  @Input() file: FileManagerFile;
  @Input() category: FileManagerCategory;
  modelForm: FormGroup;
  submitted: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private fileManagementService: FileManagementService,
    private tagsState: TagsStateService,
    public formBuilder: FormBuilder,
    public previewFileStateService: PreviewFileStateService,
    public fileManagementStateService: FileManagementStateService,
    public fileManagementRealTimeService: FileManagementRealTimeService,
    public cd: ChangeDetectorRef,
    public ticketsService: TicketsService,
  ) { }

  ngOnInit() {
    if (this.file) this.selectedTags = JSON.parse(JSON.stringify(this.file.tags));
    this.modelForm = this.formBuilder.group({
      name: [
        this.file && this.file.name || this.category && this.category.name,
        [Validators.required, Validators.minLength(1), this.file ? Validators.maxLength(100) : Validators.maxLength(50)]
      ],
    })
    let onEditFile = this.fileManagementStateService.onEditFile.subscribe(data => {
      if (this.file && this.file.id == data.id) {
        this.file = new FileManagerFile(data);
        this.reset(this.file, null);
      }
    })
    this.sub.add(onEditFile);
    let onEditCategory = this.fileManagementStateService.onEditCategory.subscribe(data => {
      if (this.category && this.category.id == data.id) {
        this.category = new FileManagerCategory(data);
        this.reset(null, this.category);
      }
    })
    this.sub.add(onEditCategory);
    let onChangeDocument = this.fileManagementRealTimeService.changeArray.subscribe(data => {
      if (data.action === "EDIT_FILE_MANAGEMENT_CATEGORY") {
        if (this.category && this.category.id == data.data.id) {
          this.category = new FileManagerCategory(data.data);
          this.reset(null, this.category);
        }
      }
      if (data.action === "EDIT_MANAGEMENT_FILE") {
        if (this.file && this.file.id == data.data.id) {
          this.file = new FileManagerFile(data.data);
          this.reset(this.file, null);
        }
      }
      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
  }
  public reset(file, category) {
    this.file = file;
    this.category = category;
    if (this.file) this.selectedTags = JSON.parse(JSON.stringify(this.file.tags));
    this.modelForm.controls["name"].setValue(this.file && this.file.name || this.category && this.category.name);
    this.modelForm = this.formBuilder.group({
      name: [
        this.file && this.file.name || this.category && this.category.name,
        [Validators.required, Validators.minLength(1), this.file ? Validators.maxLength(100) : Validators.maxLength(50)]
      ],
    })
  }
  get f2() {
    return this.modelForm.controls;
  }

  isImage() {
    return this.file && (this.file.contentType === "image/jpg" || this.file.contentType === "image/png" || this.file.contentType === "image/jpeg" || this.file.contentType === "image/gif");
  }
  onChangeTags(data) {
    this.file.setTags(data);
    this.selectedTags = data;
    if (this.file) {
      this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(res => {
        this.fileManagementStateService.editFile(res);
      })
    }
  }
  onChangeDescription() {
    this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(res => {
      this.fileManagementStateService.editFile(res);
    })
  }
  onChange() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    if (this.file && this.modelForm.value.name != this.file.name) {
      this.file.setName(this.modelForm.value.name);
      this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(res => {
        this.fileManagementStateService.editFile(res);
      })
    }
    if (this.category && this.modelForm.value.name != this.category.name) {
      this.category.setName(this.modelForm.value.name);
      this.fileManagementService.editCategory(this.category.id, this.category.getDataForUpate()).subscribe(res => {
        this.fileManagementStateService.editCategory(res);
      })
    }
  }
  parseDate(item) {
    return moment(new Date(item)).format('DD MMM YYYY hh:mm A');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  preview() {
    if (this.file.contentType === "image/jpg" || this.file.contentType === "image/png" || this.file.contentType === "image/jpeg") this.previewFileStateService.initPreview(this.file);

  }
  download() {
    this.ticketsService.downloadFile(this.file.mediaFileId, this.file.contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      if (isFirefox) {
        link.href = `${window.location.origin}/file/${this.file.mediaFileId}/attachment`;
        link.target = "_blank";
      } else {
        link.download = `${this.file.name}.${this.file.contentType.substring(this.file.contentType.indexOf("/") + 1, this.file.contentType.length)}`;
      }
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    })
  }
}
