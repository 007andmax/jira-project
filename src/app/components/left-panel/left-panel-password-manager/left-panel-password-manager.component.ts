import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { UsersService } from "../../../services/users/users.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { PasswordRecordCategories } from '../../password-manager/class/password-record-categories';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';

/**
 * Left panel password manager component
 */
@Component({
  selector: 'app-left-panel-password-manager',
  templateUrl: './left-panel-password-manager.component.html',
  styleUrls: ['./left-panel-password-manager.component.scss']
})
export class LeftPanelPasswordManagerComponent implements OnInit {
  @Input() activePage: string = "";
  categories: Array<PasswordRecordCategories> = [];
  selectedCategory: PasswordRecordCategories;
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  /**
   * Creates an instance of the LeftPanelPasswordManagerComponent with the injected services
   * @param {CompaniesService} companiesService Service to work with companies
   * @param {DevicesService} devicesService Service to work with devices
   * @param {UsersService} userService Service to work with users
   * @param {PasswordManagerService} passwordManagerService Service to work with password manager
    * @param {GadgetsService} gadgetsService Service to work with gadget
   * @param {ChangeDetectorRef} cdRef Service to work with change detection
   */
  constructor(
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private passwordManagerService: PasswordManagerService,
    private gadgetsService: GadgetsService,
    private cdRef: ChangeDetectorRef,
    private usersStateService: UsersStateService,
    private companiesState: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    private passwordManagerStateService: PasswordManagerStateService,
  ) {

  }

  /**
   * Initializes left panel password manager. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
    })
  }
  public openPanel() {
    this.onOpenPanel.emit(null);
  }
  public selectCategory(data) {
    this.selectedCategory = data;
    this.passwordManagerStateService.setFilterByCategory(this.selectedCategory);
  }
  public goToAll() {
    this.goToState();
    this.selectCategory(null)
  }
  public goToState() {
    this.onChangeState.emit('password-manager');
  }
  public trackById(index, item) {
    return item.id;
  }
}
