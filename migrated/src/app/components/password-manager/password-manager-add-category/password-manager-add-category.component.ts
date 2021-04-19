import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { PasswordRecordCategories } from '../class/password-record-categories';

@Component({
  selector: 'app-password-manager-add-category',
  templateUrl: './password-manager-add-category.component.html',
  styleUrls: ['./password-manager-add-category.component.scss']
})
export class PasswordManagerAddCategoryComponent implements OnInit {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  name: string = "";
  categories: Array<PasswordRecordCategories> = [];
  disableCreateCategory: boolean = false;
  sub: Subscription = new Subscription();
  constructor(
    private passwordManagerService: PasswordManagerService,
    private passwordManagerStateService: PasswordManagerStateService,
    private inventoryStateService: InventoryStateService,) { }

  ngOnInit() {
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
    })
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
    this.passwordManagerService.addCategories(this.name).subscribe(data => {
      this.close();
    })
  }
  public close() {
    this.onClose.emit(null);
  }

}
