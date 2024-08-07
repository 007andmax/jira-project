import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { FileManagementAddFileComponent } from '../file-management-add-file/file-management-add-file.component';

@Component({
  selector: 'app-file-management-header',
  templateUrl: './file-management-header.component.html',
  styleUrls: ['./file-management-header.component.scss']
})
export class FileManagementHeaderComponent implements OnInit {
  sort: string = "Date";
  searchText: string = "";
  activePage: string = "";
  toggleAddCategory: boolean = false;
  sub: Subscription = new Subscription();
  @Output() onSort = new EventEmitter<any>();
  constructor(private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    private fileManagementService: FileManagementService,
    private fileManagementStateService: FileManagementStateService,
    private modalService: NgbModal,
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
    const modalRef = this.modalService.open(FileManagementAddFileComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });

    //   this.fileManagementStateService.showAsideForAdd();
  }
  setSort(data) {
    this.sort = data;
    this.onSort.emit(data);
  }

}
