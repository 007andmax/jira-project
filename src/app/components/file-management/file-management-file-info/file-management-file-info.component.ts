import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileManagementCategory } from '../class/file-management-category';
import { FileManagementFile } from '../class/file-management-file';
import { TicketsPermissionsService } from '../../tickets/tickets/ticket-edit-aside/services/tickets-permissions.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { TagsStateService } from 'src/app/states/tags/tags-state.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  ) { }

  ngOnInit() {
    console.log("this.file", this.file);
    let onGetTags = this.tagsState.onGetTags.subscribe(data => {
      if (this.file) this.selectedTags = data.filter(item => this.file.tags.some(tag => tag == item.id));
    })
    this.sub.add(onGetTags);
    if (this.tagsState.getTags().length > 0) {
      if (this.file) this.selectedTags = this.tagsState.getTags().filter(item => this.file.tags.some(tag => tag == item.id));
    }
    this.modelForm = this.formBuilder.group({
      name: [
        this.file && this.file.name || this.category && this.category.name,
        [Validators.required, Validators.min(1), Validators.min(100)]
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
    this.file.setTags(data.map(item => item.id));
    this.selectedTags = data;
    if (this.file) {
      this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(data => {

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
      this.fileManagementService.editFile(this.file.id, this.file.getDataForUpate()).subscribe(data => {

      })
    }
    if (this.category) {
      this.category.setName(this.modelForm.value.name);
      this.fileManagementService.editCategory(this.category.id, this.category.getDataForUpate()).subscribe(data => {

      })
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
