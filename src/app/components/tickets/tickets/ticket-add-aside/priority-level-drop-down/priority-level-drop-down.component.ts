import { Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { StatusColor } from '../../../class/status-color';

@Component({
  selector: 'app-priority-level-drop-down',
  templateUrl: './priority-level-drop-down.component.html',
  styleUrls: ['./priority-level-drop-down.component.scss']
})
export class PriorityLevelDropDownComponent extends DropDownComponent {

  @Input() statusColors: Array<StatusColor> = [];

}
