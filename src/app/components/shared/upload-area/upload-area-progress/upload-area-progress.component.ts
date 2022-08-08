import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-upload-area-progress',
  templateUrl: './upload-area-progress.component.html',
  styleUrls: ['./upload-area-progress.component.scss']
})
export class UploadAreaProgressComponent implements OnInit {
  @Input() progress = 0;
  @Input() color = "#4c97cb";
  constructor() { }

  ngOnInit() {
  }

}
