import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PreviewAttachmentStateService } from './services/preview-attachment-state.service';

@Component({
  selector: 'app-preview-attachment',
  templateUrl: './preview-attachment.component.html',
  styleUrls: ['./preview-attachment.component.scss']
})
export class PreviewAttachmentComponent implements OnInit {
  src = "";
  show:boolean = false;
  constructor(private previewAttachmentStateService: PreviewAttachmentStateService, public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.previewAttachmentStateService.getOnPreview().subscribe(data => {
      this.src = data;
      this.show = true;
      this.cd.detectChanges();
    })
  }

}
