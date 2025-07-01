import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiKeys } from '../class/api-keys';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PermissionManageService } from 'src/app/services/permission-manage/permission-manage.service';
import { ApiKeysStateService } from 'src/app/states/api-keys/api-keys-state.service';
import { ApiKeysService } from 'src/app/services/api-keys/api-keys.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'app-company-profile-api-keys-add-aside',
  templateUrl: './company-profile-api-keys-add-aside.component.html',
  styleUrls: ['./company-profile-api-keys-add-aside.component.scss']
})
export class CompanyProfileApiKeysAddAsideComponent implements OnInit {
  modelForm: FormGroup;
  submitted: boolean = false;
  opened: boolean = false;
  sections = {};
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  constructor(public cd: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    private permissionManageService: PermissionManageService,
    private apiKeysStateService: ApiKeysStateService,
    private apiKeysService: ApiKeysService) { }

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      title: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
      ],
      permissions: [
        []
      ],
    })
    this.sections = this.permissionManageService.getsections();
    this.apiKeysStateService.onAdd.subscribe((data) => {
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
    this.modelForm.controls["permissions"].setValue(list);
    console.log(this.modelForm.controls["permissions"]);
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
    this.apiKeysService.add(this.modelForm.value).subscribe(data => {
      this.apiKeysStateService.fastAdd(data);
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  get f2() {
    return this.modelForm.controls;
  }
}
