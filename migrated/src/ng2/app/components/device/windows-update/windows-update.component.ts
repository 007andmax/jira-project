import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, } from 'ngx-uploader';
import { WindowUpdateService } from '../_services/window-update.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-windows-update',
  templateUrl: './windows-update.component.html',
  styleUrls: ['./windows-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WindowsComponent implements OnInit {
  allUpdate = false;
  details = false;
  create = false;
  expand = false;
  editAddUser = false;
  addUser = false;
  assignExpand = false;

  url = 'http://localhost:4200/upload';
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;

  constructor(private windowUpdateService: WindowUpdateService,
    private toastr: ToastrService) {
    this.options = { concurrency: 1, maxUploads: 10, maxFileSize: 1000000 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.url,
        method: 'POST',
        data: { foo: 'bar' }
      };

      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }

    // this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  myDateValue: Date;

  ngOnInit() {
    this.myDateValue = new Date();
    this.getAllWindowUpdateList();
  }

  onDateChange(newDate: Date) {
    console.log(newDate);
  }

  getAllWindowUpdateList () {
    this.windowUpdateService.getAllWindowUpdateList()
    .pipe(first())
    .subscribe(resp => {
    },
    error => {
    });
  }

  show = false;


}
