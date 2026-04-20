import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanyTagsComponent } from '../../companies/company-tags/company-tags.component';
import { CompanyDropDownComponent } from '../company-drop-down/company-drop-down.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipComponent } from '../mat-chip/mat-chip.component';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { DynamicTooltipComponent } from '../dynamic-tooltip/dynamic-tooltip.component';
import { MatChipListComponent } from '../mat-chip-list/mat-chip-list.component';
import { MatFormFieldComponent } from '../mat-form-field/mat-form-field.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-multi-company-drop-down',
    templateUrl: './multi-company-drop-down.component.html',
    styleUrls: ['./multi-company-drop-down.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgbDropdownModule,
        MatFormFieldComponent,
        MatChipListComponent,
        DynamicTooltipComponent,
        NgFor,
        MatChipComponent,
        NgIf,
        NgClass,
    ],
})
export class MultiCompanyDropDownComponent extends CompanyDropDownComponent {
  @Input() selectedCompanies = [];
  @Output() onChangeCompanies = new EventEmitter<any>();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('userInput', { static: true }) userInput: ElementRef<HTMLInputElement>;
  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.selectedCompanies.splice(index, 1);
      this.onChangeCompanies.emit(this.selectedCompanies);
      this.ref.detectChanges();
    }
  }
  onSearch(event) {
    this.list = this.reqList.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
    this.ref.markForCheck();
  }
  isSeleted(item) {
    return this.selectedCompanies.find(element => element.id === item.id);
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedCompanies.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedCompanies.splice(findIndex, 1);
    } else {
      this.selectedCompanies.push(newItem);
      this.list = this.reqList;
    }
    this.onChangeCompanies.emit(this.selectedCompanies);
    this.userInput.nativeElement.value = '';
  }
  public trackById(index, item) {
    return item.id;
  }
}
