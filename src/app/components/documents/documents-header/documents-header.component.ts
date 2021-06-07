import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';


@Component({
  selector: 'documents-header',
  templateUrl: './documents-header.component.html',
  styleUrls: ['./documents-header.component.css']
})
export class DocumentsHeaderComponent implements OnInit {
  toggleFilter: boolean = true;
  countFilter: number = 0;
  activePage: string = "";
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAll = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Input() selectAll: boolean = false;


  sub: Subscription = new Subscription();
  searchText: string = "";
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
    * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      this.activePage = data;
      console.log("this.activePage", this.activePage);
    })
    console.log("this.activePage", this.activePage);
  }
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }
  back() {
    this.leftPanelStateService.goToState('new-documents');
  }
  toggleAll(data) {
    this.selectAll = true;
    this.onSelectAll.emit(data);
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
  }
  search(event) {
    this.onSearch.emit(event.target.value);
  }
  goToAddDocument() {
    if (this.getPermissions('CREATE_DOCUMENT')) this.leftPanelStateService.goToState('new-add-documents');
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }

  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
