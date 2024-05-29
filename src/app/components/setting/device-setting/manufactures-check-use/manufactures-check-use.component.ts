import { Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { ManufacturesCheckUseItem } from './class/manufactures-check-use-item';
import { Subscription } from 'rxjs';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { ModelDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/model-device';

@Component({
  selector: 'app-manufactures-check-use',
  templateUrl: './manufactures-check-use.component.html',
  styleUrls: ['./manufactures-check-use.component.scss'],
  providers: [TicketsListService]
})
export class ManufacturesCheckUseComponent implements OnInit {
  @Input() manufacture: ManufactureDevice;
  @Input() model: ModelDevice;
  list: Array<ManufacturesCheckUseItem> = [];
  showPreloader: boolean = true;
  listColorNoAvatar = [];
  sub: Subscription = new Subscription();
  constructor(private devicesService: DevicesService,
    public ticketsListService: TicketsListService,
    private companiesStateService: CompaniesStateService,
    public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.devicesService.validateManufacturesAndModelForRemove(this.manufacture.id, this.model ? this.model.id : null).subscribe((data: any) => {
      this.getList(data);
    })
  }
  getNameForAvatar(name) {
    return name[0].toUpperCase();
  }
  getList(data) {
    this.list = data.devices.map(item => new ManufacturesCheckUseItem(item, this.ticketsListService.randomInteger(0, 6))).sort((a, b) => (this.getCompanyName(a.companyId).toLowerCase() > this.getCompanyName(b.companyId).toLowerCase()) ?
      1 : ((this.getCompanyName(b.companyId).toLowerCase() > this.getCompanyName(a.companyId).toLowerCase()) ? -1 : 0));;
    this.showPreloader = false;
  }
  getCompanyName(data) {
    return this.companiesStateService.getCompanies().find(item => item.id === data).name;
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };

  approveConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(true);
  };
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
