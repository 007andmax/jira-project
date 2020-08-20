import { Component, OnInit, Input } from '@angular/core';
import { GlNumber } from '../../../reports/class/gl-number';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { DefaultServices } from '../class/default-service';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';

@Component({
  selector: 'app-default-services-item',
  templateUrl: './default-services-item.component.html',
  styleUrls: ['./default-services-item.component.scss']
})
export class DefaultServicesItemComponent implements OnInit {
  @Input() service: DefaultServices;
  glNumbers: Array<GlNumber> = [];
  constructor(private glNumberStateService: GlNumberStateService,
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
  getSelectedTaxNames(taxes) {
    return taxes && taxes.map((tax) => {
      return tax.name + ' ' + tax.rate + '%';
    }).join(', ') || 'No taxes';
  };
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
}
