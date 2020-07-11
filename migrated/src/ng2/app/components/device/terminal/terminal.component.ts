import { Component, OnInit ,ViewEncapsulation, ViewChild  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';



@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TerminalComponent implements OnInit {
  create = false;
  closeResult = '';
  submitted = false;
  @ViewChild('commandFrm') form: any;
  commandModal = {
    title: '',
    command: '',
    category: '',
    type: ''
  };
  commandList = [];
  cmdCategoryList = [];
  cmdCategoryReadList = [{id: 1, name: 'Window > USB access 1'}, {id: 2, name: 'Window > USB access 2'}, {id: 3, name: 'Window > USB access 3'}];
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: NgbModal  
    ) { }

  ngOnInit() {
    this.getCommandList();
    this.getCmdCategory();
  }

  getCommandList () {
    
    this.terminalService.getCommand()
    .pipe(first())
    .subscribe(data => {
      if (isArray(this.commandList)) {
        this.commandList = data;
      }
    },
    error => {
      const statusError = error;
      if (statusError && statusError.meta) {
        this.toastr.error(statusError.meta.message);
      } else {
        this.toastr.error('Something went wrong please try again.');
      }
    });
  }

  getCmdCategory () {
    
    this.terminalService.getCmdCategory()
    .pipe(first())
    .subscribe(data => {
      if (isArray(this.cmdCategoryReadList)) {
        // this.cmdCategoryReadList = data;
        this.cmdCategoryList = data;
      }
    },
    error => {
      const statusError = error;
      if (statusError && statusError.meta) {
        this.toastr.error(statusError.meta.message);
      } else {
        this.toastr.error('Something went wrong please try again.');
      }
    });
  }

  manageCategory(template) {
    this.modalService.open(template, {ariaLabelledBy: 'modal-basic-title' ,windowClass: 'cmn-terminal-modal confirm-control' , centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
    });
  }

  addNewCategory() {
    this.cmdCategoryList.push({id: '', name: '', create: true})
  }

  
  createCommand() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    return;
    // let data = JSON.parse('{"priorityLevel":"MEDIUM","linkedAgentId":"fe0f3eea-95ae-466a-a084-7b8a298e85e7","note":"dfdsf","subject":"dfdsfdf","createdUser":{"firstName":"Tom","id":"31a80b98-57b8-4157-bbec-2634524ca97f","primaryEmail":"","companyId":"d9adf435-0f98-41cc-98a2-22ddf4a83a2f"},"ticketAssignTo":{"id":"3814fb4c-5bd0-4718-a48f-e67e6e84d4d6","accountType":"TECH","company":{"isDefault":false,"id":"9eb35e10-e243-4c07-baf0-c234fcd93766"},"avatar":{"id":"e825f093-9252-46df-80b6-b18fa9155cf9","origin":{"id":"dbe7ae53-449c-44e0-b1e4-6f10e91f9f77","createdAt":null,"updatedAt":null,"deletedAt":null,"isOpened":false,"linkId":null,"linkType":null},"cropped":{"id":"1fa0ba8c-e531-4ef6-8e70-44502175acc8","createdAt":null,"updatedAt":null,"deletedAt":null,"isOpened":false,"linkId":null,"linkType":null},"x":0,"y":0,"w":128,"h":85,"updatedAt":1581753293697,"base64":null},"phoneNumbers":[],"deletedAt":null,"designation":"Technical Head","twoFactorAuthType":"DISABLED","isDefault":false,"firstName":"Deo","lastName":"John","isContact":true,"priority":0,"isEmailVerified":true,"isOwner":true,"online":null,"permissions":null,"primaryEmail":"24designstudioin@gmail.com","role":null,"secondaryEmail":null,"startPage":"UNASSIGNED","status":null,"subscription":{"id":null,"invoice":null,"ticket":null,"ticketManager":null},"techRole":null,"userEnabled":true,"requestToChangePassword":false,"userStatistic":{"id":"0f9e5266-dccd-4838-a1bd-4d93dca6bd5e","ticketsSubmitted":0,"ticketsResolved":0},"myTicketUpdated":true},"attachFileIds":[],"assignedUser":"3814fb4c-5bd0-4718-a48f-e67e6e84d4d6","shares":[{"user":{"id":"31a80b98-57b8-4157-bbec-2634524ca97f"}},{"user":{"id":"3814fb4c-5bd0-4718-a48f-e67e6e84d4d6"}}]}')
    this.terminalService.createCommand(this.form.value)
    .pipe(first())
    .subscribe(resp => {
      if (resp.id !== '') {
        this.toastr.success('Command Created Successfully');
        this.create=!this.create;
      }
    },
    error => {
      const statusError = error;
      
    });
  }

 
  
 
  openModal(template) {
    this.modalService.open(template, {ariaLabelledBy: 'modal-basic-title' ,windowClass: 'cmn-terminal-modal confirm-control' , centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
    });
  }

  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
