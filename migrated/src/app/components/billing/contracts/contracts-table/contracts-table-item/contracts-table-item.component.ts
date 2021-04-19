import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ContractItem } from '../../class/contract-item';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import * as moment from "moment";
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_CONTRACT } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsListService } from '../../services/contracts-list.service';


@Component({
  selector: 'app-contracts-table-item',
  templateUrl: './contracts-table-item.component.html',
  styleUrls: ['./contracts-table-item.component.scss'],
  providers: [ContractsListService]
})
export class ContractsTableItemComponent implements OnInit {
  @Input() contract: ContractItem;
  @Output() onPreview = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onCopy = new EventEmitter();
  @Output() onForceCreate = new EventEmitter();
  @Output() onTerminate = new EventEmitter();
  contractTypeDictionary = {
    HOURLY: 'Custom Hourly',
    BLOCK_TIME: 'Block Time',
    SERVICE_CONTRACT: 'Service Contract'
  };
  billTypeDictionary = {
    DEVICE: '/by device',
    USER: '/by user',
  };
  showNotificationReview: boolean = false;
  contractStatusDictionary = {
    CURRENT: 'Current',
    PENDING: 'Pending',
    TERMINATED: 'Terminated',
    EXPIRED: 'Expired'
  };
  constructor(private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private contractsListService: ContractsListService,
    private contractsStateService: ContractsStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.showNotificationReview = this.contractsListService.isShowUpdateNotificationReview(this.contract.reviewDate);
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  deleteContract() {
    this.confirmStateService.setConfirmAction(REMOVE_CONTRACT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete agreement?`;
    this.contractsStateService.setContractForDelete(this.contract);
  }
  forceCreate() {
    this.onForceCreate.emit(this.contract);
  }
  terminateContract() {
    this.onTerminate.emit(this.contract);
  }
  copyContract() {
    this.onCopy.emit(this.contract);
  }
  editContract() {
    this.onEdit.emit(this.contract);
  }
  preview() {
    this.onPreview.emit(this.contract);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public getType() {
    if (this.contract.type === "SERVICE_CONTRACT" && this.contract.billType === "OTHER") return 'Subscriptions';
    return `${this.contractTypeDictionary[this.contract.type]}${(this.contract.billType) ? this.billTypeDictionary[this.contract.billType] : ""}`
  }
}
