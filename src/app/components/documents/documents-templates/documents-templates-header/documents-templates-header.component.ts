import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'documents-templates-header',
  templateUrl: './documents-templates-header.component.html',
  styleUrls: ['./documents-templates-header.component.scss']
})
export class DocumentsTemplatesHeaderComponent implements OnInit {
  toggleFilter: boolean = true;
  countFilter: number = 0;
  @Output() onSearch = new EventEmitter<any>();
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

  }
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }

  search(event) {
    this.onSearch.emit(event.target.value);
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
