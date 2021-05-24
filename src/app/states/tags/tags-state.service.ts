import { EventEmitter, Injectable } from '@angular/core';
import { Tag } from 'src/app/interfaces/tag/tag';
import { TagsService } from 'src/app/services/tags/tags.service';

@Injectable({
  providedIn: 'root',
})
export class TagsStateService {
  tags: Array<Tag> = [];
  onGetTags: EventEmitter<any> = new EventEmitter();
  constructor(public tagsService: TagsService,) { }

  public onInit() {
    this.tagsService.geCompanyTags().subscribe((data: Array<Tag>) => {
      console.log("data", data);
      this.tags = data.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
        1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
      this.onGetTags.emit(this.tags);
    })

  }
  public getTags() {
    return this.tags;
  }
}
