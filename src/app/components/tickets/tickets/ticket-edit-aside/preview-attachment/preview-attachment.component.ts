import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { PreviewAttachmentStateService } from './services/preview-attachment-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preview-attachment',
  templateUrl: './preview-attachment.component.html',
  styleUrls: ['./preview-attachment.component.scss']
})
export class PreviewAttachmentComponent implements OnInit, OnDestroy {
  src = "";
  show: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private previewAttachmentStateService: PreviewAttachmentStateService, public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let getOnPreview = this.previewAttachmentStateService.getOnPreview().subscribe(data => {
      this.src = data;
      this.show = true;
      this.cd.detectChanges();
    })
    this.sub.unsubscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
