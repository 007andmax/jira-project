import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserGlobalFilter } from '../class/user-global-filters';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users/users.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'app-user-filter-save',
  templateUrl: './user-filter-save.component.html',
  styleUrls: ['./user-filter-save.component.scss']
})
export class UserFilterSaveComponent implements OnInit {
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @Input() globalFilter: UserGlobalFilter;
  oldName: string;
  constructor(public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
    private usersService: UsersService,) { }

  ngOnInit() {
    this.oldName = JSON.parse(JSON.stringify(this.globalFilter.name));
  }
  /**
* @description Confirm and close modal
*/
  cancelConfirm() {
    this.addBtn.setDisabled(false);
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
  /**
* @description Init request to add / edit global filter
*/
  save() {
    if (this.globalFilter.name.length == 0) return;
    this.addBtn.setDisabled(true);
    if (!this.globalFilter.id) {
      this.usersService.addGlobalFilter(this.globalFilter.getDataForRequest(true)).subscribe(data => {
        this.cancelConfirm();
      })
    } else {
      if (this.oldName !== this.globalFilter.name) {
        this.usersService.addGlobalFilter(this.globalFilter.getDataForRequest(true)).subscribe(data => {
          this.cancelConfirm();
        })
      } else {
        this.usersService.editGlobalFilter(this.globalFilter.id, this.globalFilter.getDataForRequest(false)).subscribe(data => {
          this.cancelConfirm();
        })
      }
    }
  }

}
