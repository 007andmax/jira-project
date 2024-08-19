import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { ManageTag } from '../class/manage-tag';
import { of, Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { catchError, map } from 'rxjs/operators';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { ManageTagsFilter } from '../class/manage-tags-filter';

@Component({
  selector: 'app-manage-tags-files',
  templateUrl: './manage-tags-files.component.html',
  styleUrls: ['./manage-tags-files.component.scss']
})
export class ManageTagsFilesComponent implements OnInit, OnDestroy {
  filter: ManageTagsFilter = new ManageTagsFilter();
  setActiveTab: string = "file";
  searchTag: string = "";
  create: boolean = false;
  tags: Array<ManageTag> = [];
  loading: boolean = true;
  sub: Subscription = new Subscription();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  @Output() onPreloader: EventEmitter<any> = new EventEmitter();
  constructor(private fileManagementStateService: FileManagementStateService,
    private confirmStateService: ConfirmStateService,
    private fileManagementService: FileManagementService,
    private tagsService: TagsService,
    private tagsRealTimeService: TagsRealTimeService,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.getTags();
    let changeTagsArray = this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED") {
        data.data.forEach(tag => {
          let index = this.tags.findIndex(item => item.id === tag.id);
          if (index > -1) {
            this.tags[index] = new ManageTag(tag);
          } else {
            this.tags.push(new ManageTag(tag));
          }
        })
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.tags.findIndex(item => item.id === data.data);
        if (index > -1) this.tags.splice(index, 1);

        let indexCompany = this.tags.findIndex(item => item.id === data.data);
        if (indexCompany > -1) this.tags.splice(indexCompany, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeTagsArray);
  }
  public onSearch(data) {
    this.searchTag = data;
    if (!this.loading) this.getTags();
  }
  getTags() {
    this.loading = true;
    this.tags = [];
    this.onPreloader.emit(this.loading);
    this.fileManagementService.getTags(0, this.searchTag).subscribe((data: any) => {
      this.tags = data.commonTagViews.map(item => new ManageTag(item));
      this.loading = false;
      this.onPreloader.emit(this.loading);
      this.cd.detectChanges();
    })
  }
  public onAdd() {
    this.create = true;
    this.cd.detectChanges();
  }
  onEditTag(item) {
    if (item.isInitEdit) {
      if (this.tags.some(tag => tag.word == item.word && tag.id != item.id)) item.setIsUniqueness(false);
      if (item.word.length === 0 || item.disableUpdate || item.isInitRequest || !item.isUniqueness) return;
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
  onFilter(field) {
    this.filter.onFilter(field, this.tags);
  }
  ConfirmDelete(tID: string, name) {
    this.onRemove.emit({ id: tID, word: name })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
