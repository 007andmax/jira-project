import { Component, OnInit } from '@angular/core';
import { DocumentsTableComponent } from 'src/app/components/documents/documents-table/documents-table.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-users-details-tab-documents-item',
    templateUrl: './users-details-tab-documents-item.component.html',
    styleUrls: ['./users-details-tab-documents-item.component.scss'],
    standalone: true,
    imports: [NgClass, NgbDropdownModule, NgIf]
})
export class UsersDetailsTabDocumentsItemComponent extends DocumentsTableComponent {


}
