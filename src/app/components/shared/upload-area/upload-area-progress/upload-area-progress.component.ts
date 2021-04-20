import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-upload-area-progress',
  templateUrl: './upload-area-progress.component.html',
  styleUrls: ['./upload-area-progress.component.scss']
})
export class UploadAreaProgressComponent implements OnInit {
  @Input() progress = 0;
  constructor() { }

  ngOnInit() {
  }

}
