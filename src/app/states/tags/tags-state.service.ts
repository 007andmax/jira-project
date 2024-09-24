import { EventEmitter, Injectable } from '@angular/core';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';
import { TagsRealTimeService } from './tags-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class TagsStateService {
  tags: Array<Tag> = [];
  onGetTags: EventEmitter<any> = new EventEmitter();
  clearState = new EventEmitter<any>();
  tagsFromEdit: EventEmitter<any> = new EventEmitter();
  constructor(public tagsService: TagsService,
    private tagsRealTimeService: TagsRealTimeService,) { }

  public onInit() {
    this.tagsRealTimeService.changeTagsArray.subscribe((data: any) => {
      if (data.action === "TAG_SAVED" && Array.isArray(data.data)) this.tags = [...this.tags, ...data.data];
      if (data.action === "TAG_SAVED" && !Array.isArray(data.data)) {
        let index = this.tags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.tags[index] = data.data;
      }
      if (data.action === "TAG_REMOVED") {
        let index = this.tags.findIndex(item => item.id === data.data.id);
        if (index > -1) this.tags.splice(index, 1);
      }
      this.onGetTags.emit(this.tags);
    })
  }
  /**
 * @description Return Array Object of Tags
*/
  public getTags() {
    return this.tags;
  }
  /**
  * @description Set list tags
*/
  public setTags(data) {
    this.tags = data;
    this.onGetTags.emit(this.tags);
  }
  /**
  * Initializes to subscribe for clear data
  */
  public onInitClear() {
    this.clearState.emit(null);
  }

  /**
  * Get subscribe for clear data
  */
  public getClearState() {
    return this.clearState
  }

  /**
  * Initializes to subscribe for edit mode
  */
  public setTagsFromtEdit(data) {
    this.tagsFromEdit.emit(data);

  }

  /**
  * Get  subscribe for edit mode
  */
  public getTagsFromEdit() {
    return this.tagsFromEdit;
  }
}
