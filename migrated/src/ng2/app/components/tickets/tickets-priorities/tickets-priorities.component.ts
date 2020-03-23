import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CompanySetting } from '../../companies/class/company-setting';

@Component({
  selector: 'app-tickets-priorities',
  templateUrl: './tickets-priorities.component.html',
  styleUrls: ['./tickets-priorities.component.scss']
})
export class TicketsPrioritiesComponent implements OnInit {
  list = [new CompanySetting('Low', 'LOW'), new CompanySetting('Medium', 'MEDIUM'), new CompanySetting('High', 'HIGH')];
  @Output() onSelected = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  getSelectedPriority() {
    let index = this.list.findIndex(item => item.selected === true);
    if (index > -1) return this.list[index].title;
    return "";
  }
  public onSelectPriority(index) {
    this.list.forEach(item => item.selected = false);
    this.list[index].selected = true;
    this.onSelected.emit(this.list[index].value);
  }
  getItemClass(item) {
    return `priority-dot ${item.title.toLowerCase()}`;
  }
  getSelectedClass() {
    return `priority-dot ${this.getSelectedPriority().toLowerCase()}`;
  }
}
