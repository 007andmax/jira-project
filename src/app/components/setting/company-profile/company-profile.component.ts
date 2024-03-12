import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SettingService } from 'src/app/services/setting/setting.service';
import { MapsAPILoader } from '@agm/core';
import { TimeZone } from '../../companies/company-time-zone/class/time-zone';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { WORK_HOURS } from 'src/app/const/time';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompanyProfileProfileComponent } from './company-profile-profile/company-profile-profile.component';
import { CompanyProfileWorkspaceComponent } from './company-profile-workspace/company-profile-workspace.component';
import { CompanyProfileOperationalHoursComponent } from './company-profile-operational-hours/company-profile-operational-hours.component';

declare var google: any;
declare var $: any;
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  tabSet: string = "tab1";
  public loading = true;
  @ViewChild('workspace') workspace: CompanyProfileWorkspaceComponent;
  @ViewChild('profile') profile: CompanyProfileProfileComponent;
  @ViewChild('operationalhours') operationalhours: CompanyProfileOperationalHoursComponent;
  sub: Subscription = new Subscription();
  constructor(
    private companyProfileService: CompanyProfileService,
    private settingStateService: SettingStateService,
    private companiesStateService: CompaniesStateService,
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.getCompanyProfile();
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
  ngOnDestroy() {
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
  }
}
