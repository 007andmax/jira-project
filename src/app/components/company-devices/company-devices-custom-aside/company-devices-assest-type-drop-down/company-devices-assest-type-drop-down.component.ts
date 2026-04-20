import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-company-devices-assest-type-drop-down',
    templateUrl: './company-devices-assest-type-drop-down.component.html',
    styleUrls: ['./company-devices-assest-type-drop-down.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgClass, NgStyle, NgIf, NgFor]
})
export class CompanyDevicesAssestTypeDropDownComponent extends DropDownComponent {


  public checkDefaultName(name) {
    if (name == "workstation" || name == "router"
      || name == "printer" || name == "switch" || name == "server"
      || name == "tablet" || name == "network device" || name == "phone" || name == "generic device") return true;
    return false;
  }
  public clearWithOutChanges() {
    this.elRef.nativeElement.querySelector("#dropdown1").value = "";
    this.isAdd = false;
    this.selectedItem = null;
    this.list = JSON.parse(JSON.stringify(this.reqList));
    this.ref.markForCheck();
  }
}
