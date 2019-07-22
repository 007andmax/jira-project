import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsStateService {

  clearState = new EventEmitter<any>();
  tagsFromEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public onInitClear() {
    this.clearState.emit(null);
  }
  public getClearState () {
    return this.clearState
  }
  public setTagsFromtEdit(data) {
    this.tagsFromEdit.emit(data);

  }
  public getTagsFromEdit () {
    return this.tagsFromEdit;
  }
}
