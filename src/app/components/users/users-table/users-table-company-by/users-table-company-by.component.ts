import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbConfig, NgbDropdown, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { GetDirectionComponent } from 'src/app/components/shared/get-direction/get-direction.component';
import { PreviewPhoneMaskComponent } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { USERS } from 'src/app/const/emails';
import { Company } from 'src/app/interfaces/company/company';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-users-table-company-by',
  templateUrl: './users-table-company-by.component.html',
  styleUrls: ['./users-table-company-by.component.scss'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgbModule,
    PreviewPhoneMaskComponent,
    NgxMaskDirective],
  providers: [provideNgxMask(), TicketsListService]
})
export class UsersTableCompanyByComponent {
  @Input() ticket: any;
  @Input() company: Company;
  @Input() indexNoAvatar: number = 0;
  @Input() listColorNoAvatar = [];
  typeDropDown: string;
  taskType: string;
  @ViewChild('dp', { static: true }) dp: NgbDropdown;
  constructor(public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    private router: Router,
    public companiesState: CompaniesStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }
  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }
  parseLogo() {
    if (this.checkLogo()) {
      return `url(${this.companiesState.getCompanyLogoUrl(this.company)}) center / cover no-repeat`;
    } else {
      return this.ticketsListService.getStyleAvatar(null, this.listColorNoAvatar[this.indexNoAvatar]);
    }
  }

  onToggleDroPDown(data) {
    this.companiesState.isOpenDropDownRequestedBy = data;
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getPrimaryPhoneNumber() {
    return this.company.companyInfo.addresses.find(item => item.isPrimary)?.phoneNumbers?.find(item => item.priority == 1)?.number;
  }
  getPrimaryShippingAddress() {
    return this.company.companyInfo.addresses.find(item => item.isPrimary);
  }
  getContact() {
    return this.company.companyInfo.contacts && this.company.companyInfo.contacts.length > 0 ? this.company.companyInfo.contacts[0] : null;
  }
  goToCompanySection(section) {
    const url = `/#/${this.companiesState.getCurrentCompany().techDomain}/company/${this.company.id}/${section}`;
    window.open(url, '_blank');
  }
  openMap() {
    if (!(this.getPrimaryShippingAddress()?.locationLat && this.getPrimaryShippingAddress()?.locationLng)) return;
    const modalRef = this.modalService.open(GetDirectionComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'cmp-comapny-modal map', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.mapSrc = "https://maps.google.com/maps/embed/v1/place?key=AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s&q=" + this.getPrimaryShippingAddress()?.locationLat + "," + this.getPrimaryShippingAddress()?.locationLng + "";
  }
  copy(value) {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = value
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }


}
