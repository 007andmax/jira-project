import { Component, Input } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { StatusColor } from '../../../class/status-color';
import { MatErrorComponent } from '../../../../shared/mat-error/mat-error.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-priority-level-drop-down',
    templateUrl: './priority-level-drop-down.component.html',
    styleUrls: ['./priority-level-drop-down.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgClass, NgStyle, NgIf, MatErrorComponent, NgFor]
})
export class PriorityLevelDropDownComponent extends DropDownComponent {

  @Input() statusColors: Array<StatusColor> = [];

}
