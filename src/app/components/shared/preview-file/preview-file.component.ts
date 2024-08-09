import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PreviewFileStateService } from 'src/app/states/file-management/preview-file-state.service';
import { FileManagementFile } from '../../file-management/class/file-management-file';

@Component({
  selector: 'app-preview-file',
  templateUrl: './preview-file.component.html',
  styleUrls: ['./preview-file.component.scss']
})
export class PreviewFileComponent implements OnInit {
  file: FileManagementFile;
  show: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public previewFileStateService: PreviewFileStateService,
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
    fetch(this.file.url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response;
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
