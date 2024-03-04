import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeviceTag } from './class/device-tag';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { DELETE_DEVICE_TAG } from 'src/app/const/confirm';

@Component({
  selector: 'app-manage-tags-devices',
  templateUrl: './manage-tags-devices.component.html',
  styleUrls: ['./manage-tags-devices.component.scss']
})
export class ManageTagsDevicesComponent implements OnInit {
  tags: Array<DeviceTag> = [];
  loading: boolean = true;
  create: boolean = false;
  compnayForm: FormGroup;
  edit: boolean = false;
  constructor(private deviceTagsStateService: DeviceTagsStateService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private deviceTagsService: DeviceTagsService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.compnayForm = this.formBuilder.group({
      name: ["", Validators.required],
      id: [""]
    });
    if (this.deviceTagsStateService.getTags().length > 0) {
      this.tags = this.deviceTagsStateService.getTags();
      this.loading = false;
    }
    if (this.deviceTagsStateService.getTags().length == 0) this.deviceTagsStateService.onInitGetTags();
    this.deviceTagsStateService.onGetTags.subscribe(data => {
      this.tags = data;
      this.loading = false;
      this.cd.detectChanges();
    }, err => {
      this.toastrService.success("The error has occurred, please check your entries");
      this.appStateService.changeDetectorRef();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_TAG) {
          this.onRemoveTag()
        }
      }
    })
    // this.sub.add(getConfirm);
  }
  onRemoveTag() {
    let data = {
      "tags": this.deviceTagsStateService.getTagForDelete().id
    };
    console.log("data", data);
    this.deviceTagsService.deleteTags(data).subscribe(res => {
      console.log("res", res);
    })
  }
  get f() {
    return this.compnayForm.controls;
  }
  public onAdd() {
    this.compnayForm.patchValue({ word: "" });
    this.edit = false;
    this.create = true;
  }
  onEditTag(item) {
    if (item.isInitEdit) {
      if (item.name.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.deviceTagsService
        .editTags(
          {
            "tags": [
              {
                "id": item.id,
                "name": item.name,
              }
            ]
          }
        )
        .pipe(map((res) => res),
          catchError(error => of(undefined))).subscribe(data => {
            item.setIsInitRequest(false);
            item.onInitEdit(false);
          }, err => {
            item.setIsInitRequest(false);
          })
    }
  }
  delete(tag) {
    this.deviceTagsStateService.setTagForDelete(tag);
    this.confirmStateService.setConfirmAction(DELETE_DEVICE_TAG);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = tag.name;

  }
}
