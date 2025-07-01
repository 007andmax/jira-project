import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { ApiKeysService } from 'src/app/services/api-keys/api-keys.service';
import { PermissionManageService } from 'src/app/services/permission-manage/permission-manage.service';
import { ApiKeysStateService } from 'src/app/states/api-keys/api-keys-state.service';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Component({
  selector: 'app-company-profile-api-keys-edit-aside',
  templateUrl: './company-profile-api-keys-edit-aside.component.html',
  styleUrls: ['./company-profile-api-keys-edit-aside.component.scss']
})
export class CompanyProfileApiKeysEditAsideComponent implements OnInit {
  modelForm: FormGroup;
  submitted: boolean = false;
  opened: boolean = false;
  sections = {};
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  constructor(public cd: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    private permissionManageService: PermissionManageService,
    private apiKeysStateService: ApiKeysStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private apiKeysService: ApiKeysService) { }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      id: [
        "",
      ],
      title: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
      ],
      key: [
        ""
      ],
      permissions: [
        []
      ],
    })
    this.sections = this.permissionManageService.getsections();
    this.apiKeysStateService.onEdit.subscribe((data) => {
      this.modelForm.patchValue({
        id: data.id,
        title: data.title,
        key: data.key,
        permissions: data.permissions
      });
      console.log("this.modelForm.value", this.modelForm.value);
      this.opened = true;
      this.cd.detectChanges();
    });
  }
  userReadable(str: string) {
    return str
      .split('_')
      .map(function (word) {
        return word[0] + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  togglePermission(permission) {
    console.log("permission", permission);
    let list = this.modelForm.controls["permissions"].value;
    console.log("list.indexOf(permission)", list.indexOf(permission));
    if (list.indexOf(permission) > -1) {
      console.log("1");
      list.splice(list.indexOf(permission), 1);
    } else {
      console.log("2");
      list.push(permission);
    }
    console.log("list", list);
    this.modelForm.controls["permissions"].setValue(list);
    console.log(this.modelForm.controls["permissions"].value);
  }
  closed() {
    this.submitted = false;
    this.opened = false;
    this.modelForm.reset();
    this.modelForm.controls["permissions"].setValue([]);
    console.log("this.modelForm.value", this.modelForm.value);
  }
  add() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.addBtn.setDisabled(true);
    let res = {
      "title": this.modelForm.value.title,
      "permissions": this.modelForm.value.permissions,
      key: this.modelForm.value.key
    }
    this.apiKeysService.edit(this.modelForm.value.id, res).subscribe(data => {
      this.apiKeysStateService.fastEdit(data);
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
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
  get f2() {
    return this.modelForm.controls;
  }

}
