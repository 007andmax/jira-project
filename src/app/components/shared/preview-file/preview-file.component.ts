import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { FileManagerFile } from '../../file-manager/class/file-manager-file';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class PreviewFileComponent implements OnInit {
  file: FileManagerFile;
  show: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public previewFileStateService: PreviewFileStateService,
    public ticketsService: TicketsService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let getOnPreview = this.previewFileStateService.onPreview.subscribe(data => {
      this.file = data;
      this.show = true;
      this.cd.detectChanges();
    })
    this.sub.unsubscribe();
  }
  download() {
    this.ticketsService.downloadFile(this.file.mediaFileId, this.file.contentType).subscribe(res => {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      const data = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = data;
      if (isFirefox) {
        link.href = `${window.location.origin}/file/${this.file.mediaFileId}/attachment`;
        link.target = "_blank";
      } else {
        link.download = `${this.file.name}.${this.file.contentType.substring(this.file.contentType.indexOf("/") + 1, this.file.contentType.length)}`;
      }
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
