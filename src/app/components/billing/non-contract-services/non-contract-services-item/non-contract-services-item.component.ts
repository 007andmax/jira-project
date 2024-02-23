import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlNumber } from '../../../reports/class/gl-number';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { NonContractServices } from '../class/non-contract-service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { REMOVE_DEFAULT_SERVICE } from 'src/app/const/confirm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { NonContractServicesStateService } from 'src/app/states/non-contract-services/non-contract-services-state.service';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';

@Component({
  selector: 'app-non-contract-services-item',
  templateUrl: './non-contract-services-item.component.html',
  styleUrls: ['./non-contract-services-item.component.scss']
})
export class NonContractServicesItemComponent implements OnInit {
  @ViewChild('glNumberSelect') glNumberSelect: DropDownComponent;
  @Input() service: NonContractServices;
  @Output() onEditService = new EventEmitter<any>();
  glNumbers: Array<GlNumber> = [];
  constructor(private glNumberStateService: GlNumberStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private nonContractServicesStateService: NonContractServicesStateService,
    private nonContractServicesService: NonContractServicesService,
    private glNumberService: GlNumberService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })

  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onChangeBillalble() {
    this.nonContractServicesService.changeBillableStatus(this.service.versionedId.id, this.service.billable).subscribe(data => {

    })
  }
  onChangeDefault() {
    this.nonContractServicesService.changeService(this.service.getDataForUpdate()).subscribe(data => {

    })
  }
  getSelectedTaxNames(taxes) {
    return taxes && taxes.map((tax) => {
      return tax.name + ' ' + tax.rate + '%';
    }).join(', ') || 'No taxes';
  };
  edit() {
    this.onEditService.emit(this.service);
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.service.glNumber = res;
      this.onChangeDefault();
    })
  }
  onSelectGlNumbers(data) {
    this.service.glNumber = data;
    if (data == null) {
      this.glNumberSelect.clearWithOutChanges();
      this.onChangeDefault();
    } else {
      this.onChangeDefault();
    }
  }

  delete() {
    this.confirmStateService.setConfirmAction(REMOVE_DEFAULT_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to delete ${this.service.name}?`;
    this.nonContractServicesStateService.setServiceForRemove(this.service);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }

  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
}
