import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeInAnimation } from 'src/app/animations';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { ServiceComponent } from './service/service.component';
import { ContractComponent } from './contract/contract.component';
import { ProductComponent } from './product/product.component';
import { CompanyComponent } from './company/company.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
    selector: 'app-commission',
    templateUrl: './commission.component.html',
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./commission.component.scss'],
    standalone: true,
    imports: [NgbNavModule, CompanyComponent, ProductComponent, ContractComponent, ServiceComponent]
})
export class CommissionComponent implements OnInit, OnDestroy {

  constructor(private settingStateService: SettingStateService,) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.settingStateService.setComponentName('CommissionComponent');
  }

  ngOnDestroy() {
    $('body').removeClass('page-settings');
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }

}
