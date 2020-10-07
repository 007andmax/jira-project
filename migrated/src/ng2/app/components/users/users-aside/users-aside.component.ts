import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';
import { CROPP_AVATAR_USER } from 'src/ng2/app/const/image-cropp';
import { UserProfile } from '../class/user-profile';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { UsersAsideService } from './services/users-aside.service';
import { UserValidate } from '../class/user-validate';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { SelectClientCompanyStateService } from '../../shared/select-client-company/services/select-client-company-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';

@Component({
  selector: 'app-users-aside',
  templateUrl: './users-aside.component.html',
  styleUrls: ['./users-aside.component.scss'],
  providers: [UsersAsideService]
})
export class UsersAsideComponent implements OnInit {
  @ViewChild('role') role: any;
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  public opened = false;
  user: UserProfile = new UserProfile();
  allTitles: Array<string> = [];
  validate: UserValidate = new UserValidate();
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  constructor(private imageCropperStateService: ImageCropperStateService, private usersStateService: UsersStateService,
    private usersAsideService: UsersAsideService, private usersService: UsersService,
    private companiesState: SelectClientCompanyStateService,
    private companySubscriptionState:CompanySubscriptionStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersTitle(data);
    })
    this.usersAsideService.addSubscription(getOnUsers);
    this.onCroppImage();
    this.usersStateService.getOpenAside().subscribe(data => {
      this.role.clearClient()
      this.opened = true;
      this.companySubscriptionState.onEditMode(this.user.subscription);
    })
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (!this.opened || !data || this.imageCropperStateService.getAction() !== CROPP_AVATAR_USER) return;


      if (data.edit) {
        //  this.company.editLogo(data);
      } else {
        this.user.setLogo(data);
      }

    })
    this.usersAsideService.addSubscription(getConfirm);
  }
  getUsersTitle(allUsers) {
    this.allTitles = allUsers
      .map((user) => {
        return user.designation;
      })
      .reduce((acc, title) => {
        let index = acc.findIndex((el) => {
          return (el || '').toLowerCase() === (title || '').toLowerCase();
        })

        if (index === -1 && title) {
          acc.push(title);
        }

        return acc;
      }, []).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));

  }
  addPhoneNumber() {
    this.user.addPhoneNumber();
    this.validate.addPhoneNumber();
  }
  onChangeSubscriptions(data) {
     
    data.forEach(item => this.user.subscription[item.field] = item.selected);
  //  this.user.setSubscriptions(data);
  }
  onCheckEmail() {

    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);
     
  }
  
  onSelectDesignation(data) {
     
    this.user.setDesignation(data);
  }
  onSelectRole(data) {
    this.user.setRole(data);
  }
  onChangeFistname() {
    this.validate.checkValidFirstName(this.user.firstName);
  }
  uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_USER);
    this.imageCropperStateService.uploadFileOnBrower(event);
  }
  public onSelectCompany(selectClient) {

    this.user.serCompanyId((selectClient === 'null') ? null : selectClient.item.id);
    if (selectClient !== 'null') this.validate.setCompanyValid();

  }
  getUserType() {
    if (this.user.role === 'USER') return 'Standar User';
    if (this.user.role === 'ADMIN') return 'Manager';
  }
  onAdd() {
    if (!this.validate.isValidate(this.user)) return;
    this.addBtn.setDisabled(true);
    this.usersService.addUser(this.user.getUserForAdd()).subscribe(data => {
      this.close();
      this.addBtn.setDisabled(false);
    },err => {
      this.addBtn.setDisabled(false);
    })

  }
  close() {
    this.opened = false;
    this.user = new UserProfile();
    this.validate = new UserValidate();
    this.companiesState.onInitClear();
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  removePhoneNumber (i) {
    this.user.phoneNumbers.splice(i);
    this.validate.removePhoneNumber(i);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
