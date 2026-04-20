import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ticket } from '../../../class/ticket';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { StatusColor } from '../../../class/status-color';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-merge-tickets-item',
    templateUrl: './merge-tickets-item.component.html',
    styleUrls: ['./merge-tickets-item.component.scss'],
    standalone: true,
    imports: [NgbTooltipModule, NgClass, NgIf, NgStyle]
})
export class MergeTicketsItemComponent implements OnInit {
  @Input() item: Ticket;
  @Input() primaryTicket: Ticket;
  @Output() onSetSelected = new EventEmitter();
  @Output() onRemove = new EventEmitter();
  @Input() listColors: Array<StatusColor> = [];
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
  remove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.primaryTicket && this.primaryTicket.id == this.item.id) return;
    this.onRemove.emit(null);
  }

}
