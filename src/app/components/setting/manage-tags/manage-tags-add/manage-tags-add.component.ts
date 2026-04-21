import { MatErrorComponent } from './';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TagsService } from 'src/app/services/tags/tags.service';
import { ManageTag } from '../class/manage-tag';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule],
    selector: 'manage-tags-add',
    templateUrl: './manage-tags-add.component.html',
    styleUrls: ['./manage-tags-add.component.scss'],
    standalone: true
})
export class ManageTagsAddComponent implements OnInit {
  name: string = "";
  isInitRequest: boolean = false;
  isUniqueness: boolean = true;
  @Input() checkUniqueness: boolean = false;
  @Input() list: Array<ManageTag> = [];
  @Input() setActiveTab: string;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private tagsService: TagsService,) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0 || this.isInitRequest) return;
    const tags: any = {
      colorCode: 0,
      usedCounter: 0,
      word: this.name
    };
    if (this.setActiveTab == "file") tags.defaultTag = "FILE_TAG";
    if (this.checkUniqueness && this.list.some(item => item.word == this.name)) {
      this.isUniqueness = false;
      return;
    }
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
    this.isUniqueness = true;
    if (event.keyCode === 13) this.save();
  }
}
