import { NgModule } from '@angular/core';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle,NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@NgModule({
  imports: [NgbDropdownToggle,NgbModal]  
})
export class CompanyDashboardComponent implements OnInit {
  
 
  constructor(private modalService: NgbModal) {}
  closeResult = '';

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

  ngOnInit() {
  }

}
