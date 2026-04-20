import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TerminalService } from '../../_services/terminal.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TerminalStateService } from '../../states/terminal-state.service';
import { isArray } from 'util';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'terminal-manage-category',
    templateUrl: './terminal-manage-category.component.html',
    styleUrls: ['./terminal-manage-category.component.scss'],
    providers: [NgbModalConfig, NgbModal],
    standalone: true,
    imports: [FormsModule, NgFor, NgIf]
})
export class TerminalManageCategoryComponent implements OnInit {
  cmdCategoryList = [];
  constructor(public activeModal: NgbActiveModal,
    private terminalService: TerminalService,
    private terminalStateService: TerminalStateService,
    private toastr: ToastrService,) { }

  ngOnInit() {
    this.getCmdCategory();
  }
  closeModal() {
    this.activeModal.close();
  }
  updateCategory(data, index) {
    if (data.name == '') {
      return;
    }
    this.terminalService.updateCategory(data)
      .pipe(first())
      .subscribe(resp => {
        if (resp.id !== '') {
          this.cmdCategoryList[index].edit = false;
          this.toastr.success('Category Updated Successfully');
          this.terminalStateService.initGetCmdCategoryRead();

        }
      },
        error => {
          const statusError = error;
        });
  }
  createCategory(data) {
    if (data.name == '') {
      return;
    }
    this.terminalService.createCategory({ name: data.name })
      .pipe(first())
      .subscribe(resp => {
        if (resp.id !== '') {
          this.cmdCategoryList[this.cmdCategoryList.length - 1].create = false;
          this.cmdCategoryList[this.cmdCategoryList.length - 1].edit = false;
          this.toastr.success('Category Created Successfully');
          this.terminalStateService.initGetCmdCategoryRead();

        }
      },
        error => {
          const statusError = error;
        });
  }
  getCmdCategory() {

    this.terminalService.getCmdCategory()
      .pipe(first())
      .subscribe(data => {

        if (isArray(this.cmdCategoryList)) {
          this.cmdCategoryList = data;
        }
      },
        error => {

          const statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error('Something went wrong please try again.');
          }
        });
  }
  deleteCategory(id, index) {
    this.terminalService.deleteCategory(id)
      .pipe(first())
      .subscribe(resp => {
        this.cmdCategoryList.splice(index, 1);
        this.toastr.success('Category Deleted Successfully');
      },
        error => {
          const statusError = error;
        });
  }
  addNewCategory() {
    if (this.cmdCategoryList.length === 0 || (this.cmdCategoryList.length > 0 && (this.cmdCategoryList[this.cmdCategoryList.length - 1].create === undefined || this.cmdCategoryList[this.cmdCategoryList.length - 1].create === false))) {
      this.cmdCategoryList.push({ id: '', name: '', create: true })
    }
  }

}
