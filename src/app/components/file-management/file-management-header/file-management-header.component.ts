import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FileManagementService } from 'src/app/services/file-management/file-management.service';
import { FileManagementStateService } from 'src/app/states/file-management/file-management-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { FileManagementAddFileComponent } from '../file-management-add-file/file-management-add-file.component';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { BreadcrumbsItem } from '../class/breadcrumbs-item';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-file-management-header',
  templateUrl: './file-management-header.component.html',
  styleUrls: ['./file-management-header.component.scss']
})
export class FileManagementHeaderComponent implements OnInit {
  @Input() breadcrumbs: Array<BreadcrumbsItem> = [];
  @Input() categoryId: string;
  @Input() isShowCompanyArchived: boolean = false;
  sort: string = "Date";
  searchText: string = "";
  activePage: string = "";
  toggleAddCategory: boolean = false;
  sub: Subscription = new Subscription();
  listActive: Array<TitleListType> = [new TitleListType('Active companies', 'ACTIVE'), new TitleListType('Archived companies', 'NO_ACTIVE')];
  selectedActive = new TitleListType('Active companies', 'ACTIVE');
  @Output() onSort = new EventEmitter<any>();
  @Output() onChangeCategory = new EventEmitter<any>();
  @Output() onChangeArchived = new EventEmitter<any>();
  constructor(private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    private fileManagementService: FileManagementService,
    private fileManagementStateService: FileManagementStateService,
    private modalService: NgbModal,
    public router: Router,
    public companiesStateService: CompaniesStateService,
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
    modalRef.componentInstance.categoryId = this.categoryId;
    //   this.fileManagementStateService.showAsideForAdd();
  }
  goToCategory(id) {
    if (id) {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/file-management/category/`, id]);
    }
  }
  setSort(data) {
    this.sort = data;
    this.onSort.emit(data);
  }
  selectActive(data) {
    this.selectedActive = data;
    this.onChangeArchived.emit(data.type == "NO_ACTIVE");
  }
}
