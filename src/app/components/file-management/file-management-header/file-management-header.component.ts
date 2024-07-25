import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-file-management-header',
  templateUrl: './file-management-header.component.html',
  styleUrls: ['./file-management-header.component.scss']
})
export class FileManagementHeaderComponent implements OnInit {
  activePage: string = "";
  sub: Subscription = new Subscription();
  constructor(private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    private fileManagementService: FileManagementService,
    private fileManagementStateService: FileManagementStateService
  ) { }

  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(onFirstOpen);
  }
  back() {
    this.leftPanelStateService.goToState('file-management');
  }
  addFile() {
    this.fileManagementStateService.showAsideForAdd();
  }

}
