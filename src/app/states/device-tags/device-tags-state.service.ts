import { EventEmitter, Injectable } from '@angular/core';
import { DeviceTag } from 'src/app/components/setting/manage-tags/manage-tags-devices/class/device-tag';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { DeviceTagsRealTimeService } from './device-tags-real-time.service';
import { DevicesRealTimeService } from '../devices/devices-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceTagsStateService {
  tags: Array<DeviceTag> = [];
  onGetTags: EventEmitter<any> = new EventEmitter();
  tagForDelete: DeviceTag = null;
  constructor(private deviceTagsService: DeviceTagsService,
    private deviceTagsRealTimeService: DeviceTagsRealTimeService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  public onInit() {
    this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      console.log("newChange", newChange);
      if (newChange.action === 'DEVICE_TAG_SAVED') {
        newChange.data.tags.forEach(item => this.tags.unshift(new DeviceTag(item)))
      }
      if (newChange.action === 'DEVICE_TAG_EDITED') {
        newChange.data.forEach(item => {
          let index = this.tags.findIndex(tag => tag.id == item.id);
          this.tags[index] = new DeviceTag(item);
        })
      }
      if (newChange.action === 'DEVICE_TAG_REMOVED') {
        newChange.data.forEach(item => {
          let index = this.tags.findIndex(tag => tag.id == item);
          this.tags.splice(index, 1);
        })
      }
      console.log("this.tags", this.tags);
      this.onGetTags.emit(this.tags);
    })
  }
  public getTags() {
    return this.tags;
  }
  public onInitGetTags() {
    this.deviceTagsService.getTags().subscribe((data: any) => {
      this.tags = data.tags.map(item => new DeviceTag(item));
      this.onGetTags.emit(this.tags);
    })
  }
  public setTagForDelete(data) {
    this.tagForDelete = data;
  }
  public getTagForDelete() {
    return this.tagForDelete;
  }
}
