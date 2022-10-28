import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TagsService } from 'src/app/services/tags/tags.service';

@Component({
  selector: 'manage-tags-add',
  templateUrl: './manage-tags-add.component.html',
  styleUrls: ['./manage-tags-add.component.scss']
})
export class ManageTagsAddComponent implements OnInit {
  name: string = "";
  isInitRequest: boolean = false;
  @Input() setActiveTab: string;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private tagsService: TagsService,) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0 || this.isInitRequest) return;
    const tags = {
      colorCode: 0,
      usedCounter: 0,
      word: this.name
    };
    this.isInitRequest = true;
    this.tagsService.tags(tags, this.setActiveTab).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {
          this.isInitRequest = false;
          this.onClose.emit(null);
        },
        error => {
          this.isInitRequest = false;
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }
}
