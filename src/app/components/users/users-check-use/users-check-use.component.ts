import { Component, Input, OnInit } from '@angular/core';
import { User } from '../class/user';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'users-check-use',
  templateUrl: './users-check-use.component.html',
  styleUrls: ['./users-check-use.component.scss']
})
export class UsersCheckUseComponent implements OnInit {
  @Input() user: User;
  constructor(private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,) { }

  ngOnInit() {
  }
  public getCompanyName(id) {
    return this.companiesStateService.getCompanies().find(item => item.id === id).name;
  }
  public getUserName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
}
