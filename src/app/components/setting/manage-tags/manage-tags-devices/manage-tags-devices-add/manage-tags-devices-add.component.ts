import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';

@Component({
  selector: 'app-manage-tags-devices-add',
  templateUrl: './manage-tags-devices-add.component.html',
  styleUrls: ['./manage-tags-devices-add.component.scss']
})
export class ManageTagsDevicesAddComponent implements OnInit {

  name: string = "";
  isInitRequest: boolean = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private deviceTagsService: DeviceTagsService) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0 || this.isInitRequest) return;
    const tags = {
      "tags": [
        this.name
      ]
    };
    this.isInitRequest = true;
    this.deviceTagsService.addTags(tags).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {
          this.isInitRequest = false;
          this.onClose.emit(null);
        },
        error => {
          console.log("error", error);
          this.isInitRequest = false;
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }

}
