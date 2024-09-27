import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanyDropDownComponent } from '../company-drop-down/company-drop-down.component';

@Component({
  selector: 'app-multi-company-drop-down',
  templateUrl: './multi-company-drop-down.component.html',
  styleUrls: ['./multi-company-drop-down.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiCompanyDropDownComponent extends CompanyDropDownComponent {
  @Input() selectedCompanies = [];
  @Output() onChangeCompanies = new EventEmitter<any>();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
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
}