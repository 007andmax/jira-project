import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { CategoryValdiate } from '../support-page-add-category/class/category-validate';

@Component({
  selector: 'support-page-add-sub-category',
  templateUrl: './support-page-add-sub-category.component.html',
  styleUrls: ['./support-page-add-sub-category.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SupportPageAddSubCategoryComponent implements OnInit {
  name: string = "";
  @Input() parentSupportCategoryId: string;
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  validate: CategoryValdiate = new CategoryValdiate();
  constructor(public activeModal: NgbActiveModal,
    public cd: ChangeDetectorRef,
    private supportPageCategoriesService: SupportPageCategoriesService,
    config: NgbModalConfig,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
  }
  onChangeName() {
    this.validate.checkValidName(this.name);
    this.validate.setNameExist(false);
  }

  closeModal() {
    this.activeModal.close();
  }

  addCategory() {
    if (!this.validate.isValidate(this.name)) return;
    this.addBtn.setDisabled(true);
    this.supportPageCategoriesService.addCategory({
      "name": this.name,
      "parentSupportCategoryId": this.parentSupportCategoryId
    }).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.closeModal();
    }, err => {
      this.validate.setNameExist(true);
      this.validate.setTextErrorNameExist(err.error.message);
      this.addBtn.setDisabled(false);
    })
  };

}
