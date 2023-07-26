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
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-ticket-task',
  templateUrl: './ticket-task.component.html',
  styleUrls: ['./ticket-task.component.scss']
})
export class TicketTaskComponent implements OnInit, OnDestroy {
  private tabSet: ViewContainerRef;
  @ViewChild(NgbTabset, { static: true }) set content(content: ViewContainerRef) {
    this.tabSet = content;
  };
  DateFormat = CONFIGCONSTANTS.DateFormat;
  deviceDetail = {};
  allUsersList = [];
  assignToList = [];
  ticketList = [];
  initial = true;
  idEditTicket: string = '';
  type: string = '';
  _id: string = '';
  sub: Subscription = new Subscription();
  constructor(private ticketService: TicketService,
    private toastr: ToastrService,
    public commonService: CommonServices,
    private ticketsService: TicketsService,
    private usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService) {

  }

  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
    if (this.usersStateService.getAllUsers().length > 0) this.getAllUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getAllUsers(data);
    })
    this.sub.add(getOnUsers);
  }


  getAllTicketList() {
    const data = {
      excludeTrashSpam: true,
      groupFieldFilters: [{
        predicateRule: 'AND',
        fieldFilterDtos: [{
          // "path": "agent.deviceId",
          path: 'agent.agentId',
          //values: [this.deviceDetail['agentId']]
          operator: 'EQ',
          values: [this.deviceDetail['id']]
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
          if (index > -1) element.name = (this.allUsersList[index].firstName && this.allUsersList[index].lastName) ? `${this.allUsersList[index].firstName} ${this.allUsersList[index].lastName}` : '';
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

  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }

  getAllUsers(data) {
    this.allUsersList = data;
    this.assignToList = this.allUsersList.filter(value => (value.accountType === 'TECH' && value.deletedAt === null));
    this.assignToList.forEach(element => {
      element.selected = false;
    });
    if (this.initial === true) {
      this.getAllTicketList();
    }
    this.initial = false;
  }

  toggleTicket() {
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
