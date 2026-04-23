
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyProfileProfileComponent } from './company-profile-profile/company-profile-profile.component';
import { CompanyProfileWorkspaceComponent } from './company-profile-workspace/company-profile-workspace.component';
import { CompanyProfileOperationalHoursComponent } from './company-profile-operational-hours/company-profile-operational-hours.component';
import { fadeInAnimation } from 'src/app/animations';
import { CompanyProfileApiKeysComponent } from './company-profile-api-keys/company-profile-api-keys.component';
import { ApiKeysStateService } from 'src/app/states/api-keys/api-keys-state.service';
import { CompanyProfileApiKeysAddAsideComponent } from './company-profile-api-keys/company-profile-api-keys-add-aside/company-profile-api-keys-add-aside.component';
import { CompanyProfileApiKeysEditAsideComponent } from './company-profile-api-keys/company-profile-api-keys-edit-aside/company-profile-api-keys-edit-aside.component';
declare var $: any;
@Component({
  standalone: true,
  imports: [CompanyProfileApiKeysAddAsideComponent, CompanyProfileApiKeysEditAsideComponent, CommonModule],
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  tabSet: string = "tab1";
  public loading = true;
  @ViewChild('workspace', { static: false }) workspace: CompanyProfileWorkspaceComponent;
  @ViewChild('profile', { static: false }) profile: CompanyProfileProfileComponent;
  @ViewChild('operationalhours', { static: false }) operationalhours: CompanyProfileOperationalHoursComponent;
  @ViewChild('apiKeys', { static: false }) apiKeys: CompanyProfileApiKeysComponent;

  sub: Subscription = new Subscription();
  constructor(
    private companyProfileService: CompanyProfileService,
    private settingStateService: SettingStateService,
    private companiesStateService: CompaniesStateService,
    private apiKeysStateService: ApiKeysStateService
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.settingStateService.setComponentName('CompanyProfileComponent');
  }
  public setTab(data) {
    this.tabSet = data['nextId'];
  }

  /**
   * get company profile
   */
  getCompanyProfile() {
    try {
      this.companyProfileService.getCompanyProfile().subscribe(
        (res: any) => {
          this.companiesStateService.setCompanyProfile(res);
          this.profile.getCompanyProfile(res);
        },
        error => {
          this.loading = false;
        }
      );
    } catch (error) {
      this.loading = false;
    }
  }

  /**
   * saved records
   */
  onSubmit() {
    if (this.tabSet == "tab1") this.profile.submitCompanyProfile();
    if (this.tabSet == "workspace") this.workspace.checkDomain();
    if (this.tabSet == "operationalhours") this.operationalhours.onWorkSubmit();
  }
  addAPIKey() {
    this.apiKeysStateService.openAddAside();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
  }
}
