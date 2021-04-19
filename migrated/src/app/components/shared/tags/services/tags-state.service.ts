import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsStateService {

  clearState = new EventEmitter<any>();
  tagsFromEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
  * Initializes to subscribe for clear data
  */
  public onInitClear() {
    this.clearState.emit(null);
  }

  /**
  * Get subscribe for clear data
  */
  public getClearState () {
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
  public getTagsFromEdit () {
    return this.tagsFromEdit;
  }
}
