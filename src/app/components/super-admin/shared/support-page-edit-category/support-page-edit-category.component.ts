import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { CategoryValdiate } from '../support-page-add-category/class/category-validate';

@Component({
  selector: 'support-page-edit-category',
  templateUrl: './support-page-edit-category.component.html',
  styleUrls: ['./support-page-edit-category.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SupportPageEditCategoryComponent implements OnInit {

  @Input() name: string = "";
  @Input() category_id: string;
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  validate: CategoryValdiate = new CategoryValdiate();
  constructor(public activeModal: NgbActiveModal, public cd: ChangeDetectorRef,
    private supportPageCategoriesService: SupportPageCategoriesService, config: NgbModalConfig,) {


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



  editCategory() {

    if (!this.validate.isValidate(this.name)) return;
    this.addBtn.setDisabled(true);
    this.supportPageCategoriesService.editCategory(this.category_id, {
      "name": this.name,
    }).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.closeModal();
    }, err => {
      this.validate.setNameExist(true);
      this.validate.setTextErrorNameExist(err.error.message);
      console.log("err", err);
      this.addBtn.setDisabled(false);
    })
  };


}
