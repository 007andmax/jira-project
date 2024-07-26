import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { ManageTag } from '../class/manage-tag';
import { of, Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-manage-tags-files',
  templateUrl: './manage-tags-files.component.html',
  styleUrls: ['./manage-tags-files.component.scss']
})
export class ManageTagsFilesComponent implements OnInit, OnDestroy {
  setActiveTab: string = "file";
  searchTag: string;
  create: boolean = false;
  tags: Array<ManageTag> = [];
  loading: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private fileManagementStateService: FileManagementStateService,
    private confirmStateService: ConfirmStateService,
    private fileManagementService: FileManagementService,
    private tagsService: TagsService,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.fileManagementService.getTags(0, "").subscribe((data: any) => {
      this.tags = data.commonTagViews.map(item => new ManageTag(item));
      this.loading = false;
      this.cd.detectChanges();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      /* if (data) {
         if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_TAG) {
           this.onRemoveTag()
         }
       }*/
    })
    this.sub.add(getConfirm);
  }
  public onAdd() {
    this.create = true;
    this.cd.detectChanges();
  }
  onEditTag(item) {
    if (item.isInitEdit) {
      if (item.word.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.tagsService
        .setWordForTag(
          item.id,
          item.word,
          this.setActiveTab
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
