import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SUPPORT_MODAL_ACTION_SEND } from 'src/app/const/support';
import { ModalQuoteComponent } from 'src/app/services/modal/modal-quote/modal-quote.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ConstantsStateService } from 'src/app/states/constants/constants-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { RemoteSession } from '../class/remote-sessions';
import * as moment from "moment";
import { SupportStateService } from 'src/app/states/support/support-state.service';
import { SupportService } from 'src/app/services/support/support.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';

@Component({
  selector: 'app-support-item',
  templateUrl: './support-item.component.html',
  styleUrls: ['./support-item.component.scss']
})
export class SupportItemComponent implements OnInit {
  @Input() item: RemoteSession;
  @Output() onConnectRemoteAccess = new EventEmitter();
  host: string;
  showHost: string;
  currentUser: CurrentUser;
  statusMap = {
    'URL_GENERATED': 'URL has been generated',
    'URL_OPENED': 'URL has been opened',
    'DOWNLOADED': 'Agent has been downloaded',
    'INSTALLED': 'Agent has been installed',
    'UNINSTALLED': 'Agent has been uninstalled',
    'CONNECTED': 'Agent has been connected',
    'ENDED': 'Agent finished connected'
  };
  constructor(private constantsStateService: ConstantsStateService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    private supportService: SupportService,
    private supportStateService: SupportStateService,
    private devicesService: DevicesService,
    private ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) { }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.host = this.constantsStateService.getConstant('server.url');
    this.showHost = this.host.replace(/.*?:\/\//g, "");
  }
  copyKey() {
    var textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.item.key;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
    } catch (err) {
    }
    document.body.removeChild(textArea);
  }
  copyLink() {
    var textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = `${this.host}remote?key=${this.item.key}`;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
    } catch (err) {
    }
    document.body.removeChild(textArea);
  }
  sendEmail() {
    const modalRef = this.modalService.open(ModalQuoteComponent, { windowClass: 'quote-send-modal' });
    modalRef.componentInstance.data = {
      message: `Follow that link(${this.constantsStateService.getConstant('server.url') + 'remote?key=' + this.item.key}) to download agent`,
      subject: `${this.companiesStateService.getCurrentCompany().name} remote support agent`,
      recipients: []
    };
    modalRef.componentInstance.action = SUPPORT_MODAL_ACTION_SEND;
  }
  getUserName() {
    if (this.item.status === 'DOWNLOADED' || this.item.status === 'INSTALLED') return this.item.userName;
    return 'N/A';
  }
  removeSession() {
    this.supportService.deleteRemoteSession([this.item.id]).subscribe(data => {

    })
  }
  public connectRemoteAccess(conectionType) {
    this.onConnectRemoteAccess.emit({
      sessionId: this.item.id,
      conectionType: conectionType,
      companyId: this.item.clientCompany.id
    })
    this.cd.detectChanges();
  }
  getMessage() {
    if (this.item.status == 'INSTALLED') return `User <b>${this.item.userName}</b> ${this.item.hostName ? " with hostName - '" + this.item.hostName + "'" : ''} installed agent(${this.item.version ? this.item.version : ''}). You can start remote connection`;
    if (this.item.status === 'DOWNLOADED') return `User <b> ${this.item.userName} </b> download agent. Please, waiting for install.`
    if (this.item.status === 'URL_GENERATED' || this.item.status === 'URL_OPENED') return `Direct your customer to <a href="${this.host + 'remote'}" target="_blank"><b>${this.showHost + 'remote'}</b></a> and give them this support key to join your key:<b>${this.item.key}</b>`;
    if (this.item.status === 'CONNECTED') return `<b>${this.item.performer.id === this.currentUser.id ? 'You' : this.getUserFirstLastName(this.item.performer)}</b> started remote connection at <b>${moment(this.item.startedAt).format('DD/MM/YYYY')}</b>.`;
  }
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  public getUserFirstLastName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
}
