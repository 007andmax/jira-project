import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ticket } from '../../../class/ticket';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-merge-tickets-item',
  templateUrl: './merge-tickets-item.component.html',
  styleUrls: ['./merge-tickets-item.component.scss']
})
export class MergeTicketsItemComponent implements OnInit {
  @Input() item: Ticket;
  @Input() primaryTicket: Ticket;
  @Output() onSetSelected = new EventEmitter();
  constructor(private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
  }
  selectPrimaryTicket() {
    this.onSetSelected.emit(this.item)
  }
  getCreatAt() {
    let date = new Date(this.item.createdAt);
    return `${moment(new Date(date)).format('DD MMM YYYY')}`;
  }
  getCompanyName() {
    if (!this.item.companyId) return '';
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.item.companyId);
    return (find) ? find.name : '';
  }
  onChangeNote(event) {
    // this.user.jobDescription = event.target.value;
  }
}
