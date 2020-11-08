import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, ViewContainerRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, } from 'ngx-uploader';
import { TicketService } from './../_services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../../environments/environment';
import { searchTextPipe } from './../_pipe/searchText.pipe';
import { CommonServices } from '../_services/common.service';
import { DeviceDetailService } from '../_services/device_detail.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
declare  var $:any;

@Component({
  selector: 'app-ticket-task',
  templateUrl: './ticket-task.component.html',
  styleUrls: ['./ticket-task.component.scss']
})
export class TicketTaskComponent implements OnInit, OnDestroy {
  private tabSet: ViewContainerRef;
  @ViewChild(NgbTabset) set content(content: ViewContainerRef) {
    this.tabSet = content;
  };
  @ViewChild('ticketFrm') form: any;
  url = environment.apiUrl + 'file?isAvatar=false';
  formData: FormData;
  files: UploadFile[];
  loading = false;
  myDateValue: Date;
  check_all = false;
  selectedList: any[] = [];
  create = false;
  openPopup = 'open_ticket';
  editAddUser = false;
  assignExpand = false;
  addUser = false;
  expand = false;
  search = '';
  searchUser = '';
  DateFormat = CONFIGCONSTANTS.DateFormat;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  deviceDetail = {};
  actualNumber = '';
  ticketModal = {
    subject: '',
    note: '',
    company: { name: ''},
    createduser: {id: '', name: ''},
    linkedAgentId: {id: '', hostName: ''},
    priorityLevel: 'MEDIUM',
    attachFileIds: []
  };
  priorityList = [
    {value: 'HIGH', name: 'High Priority'},
    {value: 'MEDIUM', name: 'Medium Priority'},
    {value: 'LOW', name: 'Low Priority'}
  ];
  submitted = false;
  notifyUserList = [];
  companyClientList = [];
  usersList = [];
  allUsersList = [];
  assignToList = [];
  selectedUser = {};
  assignToLabel = '';
  ticketAssignTo = {};
  priorityLabel = this.priorityList[1].name;
  ticketList = [];
  initial = true;
  linkedAgentList = [];
  idEditTicket:string = '';
  type:string = '';
  _id:string = '';

  constructor(private ticketService: TicketService,
      private toastr: ToastrService,
      public commonService: CommonServices,
      private deviceDetailService: DeviceDetailService,
      private ticketsService: TicketsService,
      private ticketsStateService: TicketsStateService) {
    this.options = { concurrency: 1, maxUploads: 10, maxFileSize: 1000000 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.myDateValue = new Date();
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
    this.getAllUsers();
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.url,
        method: 'POST',
        data: { foo: 'bar' }
      };

      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }

    // this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  onDateChange(newDate: Date) {
    console.log(newDate);
  }

  getAllTicketList () {
    const data = {
      excludeTrashSpam: true,
      groupFieldFilters: [{
        predicateRule: 'AND',
        fieldFilterDtos: [{
          path: 'agent.agentId',
          operator: 'EQ',
          values: [this.deviceDetail['agentId']]
        }]
      }],
      offset: 0
    };
    this.ticketService.getAllTicketList(data)
    .pipe(first())
    .subscribe(data => {
      this.ticketList = data;
      this.ticketList.forEach(element => {
        element.createdAt = new Date(element.createdAt);
        let index = this.allUsersList.findIndex(value => value.id === element.createdUserId);
        element.name = this.allUsersList[index].firstName + ' ' + this.allUsersList[index].lastName
      });
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

  createTicket() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.ticketModal.attachFileIds = this.files.map(value => value['response'].id);
    // company: {isDefault: false, id: this.ticketModal.company['id']},
    let tempArr = this.notifyUserList.filter(value => value.selected === true);
    let shares = [];
    tempArr.forEach(element => {
      shares.push({user: {id: element.id}})
    });
    // delete this.ticketAssignTo['selected'];
    let data = {
      priorityLevel: this.ticketModal.priorityLevel,
      subject: this.ticketModal.subject,
      note: this.ticketModal.note,
      createdUser: {firstname: this.selectedUser['firstName'], id: this.ticketModal.createduser.id, primaryemail: this.selectedUser['primaryEmail'], companyId: this.selectedUser['company'].id},
      ticketAssignTo: this.ticketAssignTo,
      linkedAgentId: this.ticketModal.linkedAgentId.id,
      attachFileIds: this.ticketModal.attachFileIds,
      assignedUser: this.ticketAssignTo['id'],
      shares: shares
    }

    // let data = JSON.parse('{"priorityLevel":"MEDIUM","linkedAgentId":"fe0f3eea-95ae-466a-a084-7b8a298e85e7","note":"dfdsf","subject":"dfdsfdf","createdUser":{"firstName":"Tom","id":"31a80b98-57b8-4157-bbec-2634524ca97f","primaryEmail":"","companyId":"d9adf435-0f98-41cc-98a2-22ddf4a83a2f"},"ticketAssignTo":{"id":"3814fb4c-5bd0-4718-a48f-e67e6e84d4d6","accountType":"TECH","company":{"isDefault":false,"id":"9eb35e10-e243-4c07-baf0-c234fcd93766"},"avatar":{"id":"e825f093-9252-46df-80b6-b18fa9155cf9","origin":{"id":"dbe7ae53-449c-44e0-b1e4-6f10e91f9f77","createdAt":null,"updatedAt":null,"deletedAt":null,"isOpened":false,"linkId":null,"linkType":null},"cropped":{"id":"1fa0ba8c-e531-4ef6-8e70-44502175acc8","createdAt":null,"updatedAt":null,"deletedAt":null,"isOpened":false,"linkId":null,"linkType":null},"x":0,"y":0,"w":128,"h":85,"updatedAt":1581753293697,"base64":null},"phoneNumbers":[],"deletedAt":null,"designation":"Technical Head","twoFactorAuthType":"DISABLED","isDefault":false,"firstName":"Deo","lastName":"John","isContact":true,"priority":0,"isEmailVerified":true,"isOwner":true,"online":null,"permissions":null,"primaryEmail":"24designstudioin@gmail.com","role":null,"secondaryEmail":null,"startPage":"UNASSIGNED","status":null,"subscription":{"id":null,"invoice":null,"ticket":null,"ticketManager":null},"techRole":null,"userEnabled":true,"requestToChangePassword":false,"userStatistic":{"id":"0f9e5266-dccd-4838-a1bd-4d93dca6bd5e","ticketsSubmitted":0,"ticketsResolved":0},"myTicketUpdated":true},"attachFileIds":[],"assignedUser":"3814fb4c-5bd0-4718-a48f-e67e6e84d4d6","shares":[{"user":{"id":"31a80b98-57b8-4157-bbec-2634524ca97f"}},{"user":{"id":"3814fb4c-5bd0-4718-a48f-e67e6e84d4d6"}}]}')
    this.ticketService.createTicket(data)
    .pipe(first())
    .subscribe(resp => {
      if (resp.id !== '') {
        this.toastr.success('Ticket Created Successfully');
        this.getAllTicketList();
        this.create=!this.create;
        this.closeTicket();
      }
    },
    error => {
      const statusError = error;
      
    });
  }

  openPopupClick() {
    this.create = !this.create;
    if (this.tabSet['activeId'] === 'ngb-tab-0') {
      this.linkedAgentList = this.deviceDetailService.getDeviceList();
      this.getActualNumber();
      this.getAllCompanyClient();
      this.getAllUsers();
      this.openPopup = 'open_ticket';
    } else if (this.tabSet['activeId'] === 'ngb-tab-1') {
      this.openPopup = 'open_task';
    }
  }

  getActualNumber() {
    this.ticketService.getActualNumber()
    .pipe(first())
    .subscribe(data => {
      this.actualNumber = data.number;
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

  getAllCompanyClient() {
    this.ticketService.getAllCompanyClient()
    .pipe(first())
    .subscribe(data => {
      this.companyClientList = data.filter(value => value.name.toLowerCase() !== 'unassigned');
    },
    error => {
      const statusError = error;
      
    });
  }

  getAllUsers() {
    this.ticketService.getAllUsers()
    .pipe(first())
    .subscribe(data => {
      this.allUsersList = data;
      this.assignToList = this.allUsersList.filter(value => (value.accountType === 'TECH' && value.deletedAt === null));
      this.assignToList.forEach(element => {
          element.selected = false;
      });
      if (this.initial === true) {
        this.getAllTicketList();
      }
      this.initial = false;
    },
    error => {
      const statusError = error;
      
    });
  }

  setUserList(data) {
    this.ticketModal.company = data;
    if (this.ticketModal.company.name !== '') {
      this.usersList = this.allUsersList.filter(value => (value.accountType === 'CLIENT' && value.company.id === this.ticketModal.company['id']));
      this.ticketModal.createduser = {id: '', name: ''};
      this.ticketModal.linkedAgentId = {id: '', hostName: ''};
    } else {
      this.usersList = [];
      this.ticketModal.createduser = {id: '', name: ''};
      this.ticketModal.linkedAgentId = {id: '', hostName: ''};
    }
    
  }

  setUserData(data) {
    const index = this.notifyUserList.findIndex(value => value.id === this.selectedUser['id']);
    if (index !== -1) {
      this.notifyUserList.splice(index, 1);
    }
    this.selectedUser = data;
    this.ticketModal.createduser.id = data.id;
    this.ticketModal.createduser.name = data.firstName + ' ' + data.lastName;
    this.notifyUserList.unshift(data);
    this.notifyUserList[0].selected = false;
  }

  addNotifyUser(data) {
    if (data.selected === true) {
      this.notifyUserList.push(data);
      this.notifyUserList[this.notifyUserList.length - 1].selected = true;
      // this.notifyUserList.forEach(element => {
      //   element.selected = true;
      // });
    } else {
      const index = this.notifyUserList.findIndex(value => value.id === data.id);
      if (index !== -1) {
        this.notifyUserList.splice(index, 1);
      }
    }
  }

  addUserFunc(data) {
    data.selected = true;
    const index = this.notifyUserList.findIndex(value => value.id === this.ticketAssignTo['id']);
    if (index !== -1) {
      this.notifyUserList.splice(index, 1);
    }
    this.notifyUserList.push(data);
    this.notifyUserList[this.notifyUserList.length - 1].selected = true;
    this.ticketAssignTo = data;
  }

  closeTicket() {
    this.ticketModal = {
      subject: '',
      note: '',
      company: { name: ''},
      createduser: {id: '', name: ''},
      linkedAgentId: {id: '', hostName: ''},
      priorityLevel: 'MEDIUM',
      attachFileIds: []
    };
    this.ticketAssignTo = {};
    this.assignToLabel = '';
    this.notifyUserList = [];
    this.files = [];
    this.submitted = false;
  }

  clearDropdown(type: string) {
    if (type === 'device') {
      this.ticketModal.linkedAgentId = {id: '', hostName: ''};
    } else if (type === 'company') {
      this.ticketModal.company = { name: ''};
    } else if (type === 'user') {
      let index = this.notifyUserList.findIndex(value => value.id === this.ticketModal.createduser['id']);
      if (index !== -1) {
        this.notifyUserList.splice(index, 1);
      }
      this.ticketModal.createduser = {id: '', name: ''};
    } else if (type === 'assign') {
      let index = this.notifyUserList.findIndex(value => value.id === this.ticketAssignTo['id']);
      if (index !== -1) {
        this.notifyUserList.splice(index, 1);
      }
      index = this.assignToList.findIndex(value => value.id === this.ticketAssignTo['id']);
      if (index !== -1) {
        this.assignToList[index].selected = false;
      }
      this.ticketAssignTo = {};
      this.assignToLabel = '';
    }
  }

  toggle(type) {
    setTimeout(() => {
      if (type === 'assign') {
        this.expand = !this.expand;
      } else if (type === 'user') {
        this.editAddUser = !this.editAddUser;
      }
    });
  }

  toggleTicket(){
    $("body").toggleClass("expandTicket");
  }

  ngOnDestroy() {
    $("body").removeClass("expandTicket");
  }

  editTicket(id) {
    this.idEditTicket = id;
    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
      this.ticketsStateService.onEditTicket(data);
    })
  }

}
