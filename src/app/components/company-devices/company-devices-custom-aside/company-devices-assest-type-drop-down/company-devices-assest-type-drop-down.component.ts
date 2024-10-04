import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'app-company-devices-assest-type-drop-down',
  templateUrl: './company-devices-assest-type-drop-down.component.html',
  styleUrls: ['./company-devices-assest-type-drop-down.component.scss']
})
export class CompanyDevicesAssestTypeDropDownComponent extends DropDownComponent {


  public getTypeToLocaleLowerCase(type) {
    return (type) ? type.toLocaleLowerCase() : '';
  }
}
