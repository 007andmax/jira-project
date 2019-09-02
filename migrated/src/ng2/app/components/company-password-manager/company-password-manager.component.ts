import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ApiPasswordManagerService } from '../../services/password-manager/api-password-manager.service';
import { CompaniesService } from '../../services/company/companies.service';
import { PasswordManagerService } from '../../services/password-manager/password-manager.service';
import { UsersService } from '../../services/users/users.service';
import { PermissionsService } from '../../services/permissions/permissions.service';

@Component({
  selector: 'company-password-manager',
  templateUrl: './company-password-manager.component.html',
  styleUrls: ['./company-password-manager.component.scss']
})
export class CompanyPasswordManagerComponent implements OnInit {

  public companiesList: any;
  public selectedCompany: any;
  public selectedUserOrDevice: any;
  public selectedDate: any;
  public selectedCategory: any;
  public newRecord: Subject<boolean> = new Subject();
  public isMobileFilterShowing = false;
  public currentUser: any;
  public showPreloader = true;
  sub:Subscription = new Subscription();
  subscription:any;
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {CompaniesService} companiesService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {userService} userService Service to work with user
   * @param {permissionsService} permissionsService to work with permissions service
   */
  public constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService,
    private passwordManagerService: PasswordManagerService,
    private userService: UsersService,
    private permissionsService: PermissionsService,
  ) {
    this.companiesService.getCompaniesList();
  }

  /**
   * Initializes Password manager. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    this.getSelectCompany();
    this.getSelectedCategory();
    this.getSelectedDeviceOrUser();
    this.getSelectedDate();
    this.getCurrentUser();
  
    this.checkCloseFilters();

    let subGetRecords = this.apiPasswordManagerService.dataChange.subscribe((res) => {
      console.log('CompanyPasswordManagerComponent');
      this.showPreloader = false;
       });
       this.sub.add(subGetRecords);
  };

  /**
   * Get selected company from filter
   */
  public getSelectCompany() {
    console.log('getSelectCompany');
    if (localStorage.getItem('company_id')) {
      let company_id = localStorage.getItem('company_id');
      console.log('company_id',company_id);
      let subscription = this.companiesService.clientsCompany
       .subscribe((company) => {
        this.refreshFilter();
         this.selectedCompany = company.find(item => item.id === company_id);
         this.apiPasswordManagerService.getRecords();
         console.log('this.selectedCompany',this.selectedCompany);
       }
     );
     this.sub.add(subscription);
    }
   /* this.companiesService.filteredCompanyUpdate.subscribe((company) => {
      this.refreshFilter();
      return this.selectedCompany = company;
    });*/
  }

  /**
   * Get selected category from filter
   */
  public getSelectedCategory() {
    this.passwordManagerService.emitSelectedCategory.subscribe((category) => {
      return this.selectedCategory = category
    });
  }

  /**
   * Get selected user or device from filter
   */
  public getSelectedDeviceOrUser() {
    this.passwordManagerService.selectedDeviceOrUser.subscribe((type) =>
      this.selectedUserOrDevice = type
    )
  }

  /**
   * Get selected date from filter
   */
  public getSelectedDate() {
    this.passwordManagerService.selectedDate.subscribe((date) => {
      if (date) {
        this.selectedDate = `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}`
      } else {
        this.selectedDate = null;
      }
    })
  }

  /**
   * Change data table show status
   */
  public showDataTable() {
    return !!((this.selectedCompany && this.selectedCompany.id.length > 0) || (this.selectedCategory && this.selectedCategory.UPPERCASE !== 'CLEAR') || (this.selectedDate));
  }

  /**
   * Add zero to date lower then 10
   */
  private formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  /**
   * Add new record
   */
  public addRecord(event) {
    this.newRecord.next(true);
  }

  /**
   * reset all filters
   */
  private refreshFilter() {
    this.selectedUserOrDevice = {};
    this.selectedDate = null;
  }

  /**
   * getCurrentUser
   */
  private getCurrentUser() {
    this.currentUser = this.userService.currentUser;
  }

  /**
   * Toggle mobile filters
   */
  public showMobileFilters() {
    this.isMobileFilterShowing = !this.isMobileFilterShowing;
  }

  /**
   * Close mobile filters
   */
  public checkCloseFilters() {
    this.passwordManagerService.closeFilter.subscribe(() => {
      this.isMobileFilterShowing = false
    } )
  }

  /**
   * destroy password manager component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
    this.sub.unsubscribe();
    
  }


}
