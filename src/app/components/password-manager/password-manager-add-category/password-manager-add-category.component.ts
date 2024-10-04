import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { PasswordRecordCategories } from '../class/password-record-categories';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'app-password-manager-add-category',
  templateUrl: './password-manager-add-category.component.html',
  styleUrls: ['./password-manager-add-category.component.scss']
})
export class PasswordManagerAddCategoryComponent implements OnInit, OnDestroy {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  name: string = "";
  categories: Array<PasswordRecordCategories> = [];
  disableCreateCategory: boolean = false;
  sub: Subscription = new Subscription();
  constructor(
    private passwordManagerService: PasswordManagerService,
    private passwordManagerStateService: PasswordManagerStateService) { }

  ngOnInit() {
    this.categories = this.passwordManagerStateService.getCategories();
    let onGetCategories = this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
    })
    this.sub.add(onGetCategories);
  }
  checkDublicateCategory() {
    var duplicateCategory = this.categories.filter((item) => {
      return item.name.toLowerCase() === this.name.toLowerCase();
    });
    this.disableCreateCategory = (duplicateCategory.length > 0);
  };
  public checkName(name) {
    return this.categories.find(item => item.name === name);
  }
  public save() {
    if (this.name.length === 0) {
      this.disableCreateCategory = true;
      return;
    };
    this.addBtn.setDisabled(true);
    this.passwordManagerService.addCategories(this.name).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
    })
  }
  public close() {
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
