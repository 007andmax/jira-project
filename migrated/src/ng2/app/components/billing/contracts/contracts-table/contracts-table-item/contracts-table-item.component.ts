import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContractItem } from '../../class/contract-item';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";


@Component({
  selector: 'app-contracts-table-item',
  templateUrl: './contracts-table-item.component.html',
  styleUrls: ['./contracts-table-item.component.scss']
})
export class ContractsTableItemComponent implements OnInit {
  @Input() contact: ContractItem;
  @Output() onPreview = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  contractTypeDictionary = {
    HOURLY: 'Hourly',
    BLOCK_TIME: 'Block Time',
    SERVICE_CONTRACT: 'Service Contract'
  };
  billTypeDictionary = {
    DEVICE: '/by device',
    USER: '/by user',
    OTHER: '/by other'
  };

  contractStatusDictionary = {
    CURRENT: 'Current',
    PENDING: 'Pending',
    TERMINATED: 'Terminated',
    EXPIRED: 'Expired'
  };
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

  }
  editContract() {
    this.onEdit.emit(this.contact);
  }
  preview() {
    this.onPreview.emit(this.contact);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public getType() {
    return `${this.contractTypeDictionary[this.contact.type]}${(this.contact.billType) ? this.billTypeDictionary[this.contact.billType] : ""}`
  }
}
