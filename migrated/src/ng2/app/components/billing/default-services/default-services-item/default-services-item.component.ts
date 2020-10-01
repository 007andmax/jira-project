import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlNumber } from '../../../reports/class/gl-number';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { DefaultServices } from '../class/default-service';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { REMOVE_DEFAULT_SERVICE } from 'src/ng2/app/const/confirm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { DefaultServicesStateService } from 'src/ng2/app/states/default-services/default-services-state.service';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';

@Component({
  selector: 'app-default-services-item',
  templateUrl: './default-services-item.component.html',
  styleUrls: ['./default-services-item.component.scss']
})
export class DefaultServicesItemComponent implements OnInit {
  @ViewChild('glNumberSelect') glNumberSelect: DropDownComponent;
  @Input() service: DefaultServices;
  @Output() onEditService = new EventEmitter<any>();
  glNumbers: Array<GlNumber> = [];
  constructor(private glNumberStateService: GlNumberStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private defaultServicesStateService: DefaultServicesStateService,
    private defaultServicesService: DefaultServicesService,
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
    this.defaultServicesService.changeBillableStatus(this.service.versionedId.id, this.service.billable).subscribe(data => {

    })
  }
  onChangeDefault() {
    this.defaultServicesService.changeService(this.service.getDataForUpdate()).subscribe(data => {

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
    console.log("this.service",this.service);
    if (data == null) {
      this.glNumberSelect.clearWithOutChanges();
      this.onChangeDefault();
    } else {
      this.onChangeDefault();
    }
  }

  delete() {
    this.confirmStateService.setConfirmAction(REMOVE_DEFAULT_SERVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete ${this.service.name}?`;
    this.defaultServicesStateService.setServiceForRemove(this.service);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }

  glDropDownItemName(item) {
    return `${item.glNumber} ${item.description ? `(${item.description})` : ''} `;
  }
}
