import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { UserListService } from '../../users/services/user-list.service';
import { CompaniesRealTimeService } from 'src/app/states/company/companies-real-time.service';
import { ShellStateService } from 'src/app/states/shell/shell-state.service';
import { command, script, commandModal, scriptModal } from './../class/device';
import { TerminalStateService } from '../states/terminal-state.service';
import { DELETE_COMMAND } from 'src/app/const/confirm';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { TerminalAsideComponent } from './terminal-aside/terminal-aside.component';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserListService]
})
export class TerminalComponent implements OnInit {
  submitted = false;
  loading = false;
  sub: Subscription = new Subscription();
  sharedScriptModal: scriptModal = {
    categoryId: '',
    search: ''
  };
  scriptDetailModal: script = {
    title: '',
    type: '',
    command: '',
    default: false,
    id: '',
    category: '',
    categoryId: '',
    typeName: '',
    description: ''
  };
  editCmd = '';

  lineNumberDetail = [1];
  deleteId = '';
  commandList = [];
  myScriptList = [];
  myScriptListFilter = [];
  sharedScriptList = [];
  sharedScriptListFilter = [];

  cmdCategoryList = [];
  cmdCategoryReadList = [];
  runScript = false;
  scriptDetail = false;
  sessionId = '';
  finalCommand = '';
  splitCommand = ["C:\\>"];
  scriptTyped = 'cmd';
  showDescription = false;
  terminalHeight = 0;
  cmdHeight = 0;
  @ViewChild('aside') aside: TerminalAsideComponent;
  @ViewChild('editor') editorElement: ElementRef;
  terminalHit = false;
  _id: string = '';
  type: string = '';
  DateTimeHistoryFormat = CONFIGCONSTANTS.DateTimeHistoryFormat;
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private shellStateService: ShellStateService,
    private terminalStateService: TerminalStateService,
    private confirmStateService: ConfirmStateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    // this.socketService.initializeWebSocketConnection();
    this.getCommandList();
    this.getCmdCategoryRead();
    // this.socketService.subsribeToCmdShellOutput();
    $('#cmd textarea').scroll(function () {
      $('#cmd_line').scrollTop($('#cmd textarea').scrollTop());
    });
    document.getElementById("terminal").style.height = window.innerHeight - document.getElementById('deviceHeader').offsetHeight - 250 + 'px';
    this.terminalHeight = document.getElementById("terminal").offsetHeight;
    this.cmdHeight = document.getElementById("editCmd").offsetHeight;
    let onGetCmdCategoryRead = this.terminalStateService.onGetCmdCategoryRead.subscribe(data => {
      this.getCmdCategoryRead();
    })
    this.sub.add(onGetCmdCategoryRead);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_COMMAND) this.deleteCommand();
      }
    })
    this.sub.add(getConfirm);
  }

  getCommandList() {
    this.terminalService.getCommand()
      .pipe(first())
      .subscribe(data => {
        if (isArray(this.commandList)) {
          this.commandList = [];
          let cmdList = [];
          let response = data;
          for (let key in response) {
            response[key].forEach(element => {
              cmdList.push(element);
            });
          }
          this.commandList = cmdList.filter(val => val.default === false);
          this.myScriptList = cmdList.filter(val => val.default === false);
          this.myScriptListFilter = cmdList.filter(val => val.default === false);
          this.sharedScriptList = cmdList.filter(val => val.default === true);
          this.sharedScriptListFilter = cmdList.filter(val => val.default === true);
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

  getCmdCategoryRead() {
    this.terminalService.getCmdCategory()
      .pipe(first())
      .subscribe(data => {
        if (isArray(this.cmdCategoryReadList)) {
          this.cmdCategoryReadList = data;
          this.cd.detectChanges();
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
  deleteCommand() {
    this.loading = true;
    this.terminalService.deleteCommand(this.deleteId)
      .pipe(first())
      .subscribe(resp => {
        this.loading = false;
        this.getCommandList();
        this.toastr.success('Command Deleted Successfully');
      },
        error => {
          this.loading = false;
        });
  }
  openEditCommand(data: any, flag: string) {
    this.aside.openEditCommand(data, flag);
  }
  openModal(id, title, flag) {
    if (flag === 'deleteCmd') {
      this.deleteId = id;
    }
    this.confirmStateService.setConfirmAction(DELETE_COMMAND);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to delete ${title} script?`;
  }
  openRunScript() {
    this.runScript = !this.runScript;
    if (this.runScript === true) {
      this.myScriptListFilter = this.myScriptList;
      this.sharedScriptListFilter = this.sharedScriptList;
    }

    this.sharedScriptModal = {
      categoryId: '',
      search: ''
    }
  }
  viewScriptDetail(data) {
    this.scriptDetail = !this.scriptDetail;
    this.showDescription = false;
    this.scriptDetailModal = data;
    this.lineNumberDetail = [];
    for (let index = 1; index <= data.command.split(/\r*\n/).length; index++) {
      this.lineNumberDetail.push(index);
    }
    this.scriptDetailModal.id = data.id;
    this.scriptDetailModal.categoryId = data.categoryId;
    if (this.scriptDetailModal.type === 'CMD') {
      this.scriptDetailModal.typeName = 'Command Line'
    } else if (this.scriptDetailModal.type === 'POWERSHELL') {
      this.scriptDetailModal.typeName = 'Powershell'
    }
    let res = this.cmdCategoryReadList.filter(x => x.id == data.categoryId);
    if (res.length > 0) {
      this.scriptDetailModal.category = res[0].name;
    } else {
      this.scriptDetailModal.category = '';
    }
  }

  copyToTerminal(cmd, type, file) {
    if (JSON.parse(localStorage.getItem('deviceDetail_' + this._id)).online === true) {
      this.finalCommand = cmd;
      this.sessionId = localStorage.getItem('uuid_' + this._id);
      this.sendCommand(type, file);
    } else {
      this.toastr.error('The device is offline');
    }

  }

  sendCommand(type, file) {
    let data: command = {
      "companyId": localStorage.getItem('company_id'),
      "agentId": this._id,
      "sessionId": this.sessionId,
      "scriptType": type === '' ? this.scriptTyped.toLowerCase() : type.toLowerCase(), // 'powershell'
      "script": this.finalCommand,
      "file": file,
      "keepOpen": true
    }

    this.terminalService.sendCommand(data)
      .pipe(first())
      .subscribe(resp => {
        if (!this.terminalHit) {
          let getCmdOutput = this.shellStateService.getCmdOutput().subscribe((data) => {
            if (this.sessionId === data.data.sessionId) {
              let arr = data.data.output.split(/\r*\n/)
              let arr1 = this.splitCommand.concat(arr);
              this.splitCommand = arr1;
              this.cd.detectChanges();
              setTimeout(() => {
                $('#terminal').scrollTop($('#terminal')[0].scrollHeight);
              }, 50);
            }
          })
          this.sub.add(getCmdOutput);
          this.terminalHit = true;
        }
      },
        error => {
          const statusError = error;
        });
  }

  cloneScript(id) {
    this.terminalService.cloneCommand(id)
      .pipe(first())
      .subscribe(resp => {
        this.toastr.success('Cloned Successfully');
        this.getCommandList();
      },
        error => {
          const statusError = error;
        });
  }

  switchTerminal(type) {
    this.scriptTyped = type;
    if (this.terminalHit === true) {
      this.splitCommand = [this.splitCommand[this.splitCommand.length - 1]];
    } else {
      this.splitCommand = ["C:\\>"];
    }
  }

  setHeight(flag) {
    if (flag === 'enter' && document.getElementById("editCmd").offsetHeight < 280) {
      document.getElementById("terminal").style.height = (document.getElementById("terminal").offsetHeight - 10) + "px";
      document.getElementById("editCmd").style.height = (document.getElementById("editCmd").offsetHeight + 10) + "px";
    } else if (flag === 'backspace') {
      let arr = this.editCmd.split(/\r*\n/)
      if (arr.length > 1 && document.getElementById("editCmd").offsetHeight > 120) {
        document.getElementById("terminal").style.height = (document.getElementById("terminal").offsetHeight + 10) + "px";
        document.getElementById("editCmd").style.height = (document.getElementById("editCmd").offsetHeight - 10) + "px";
      } else {
        document.getElementById("terminal").style.height = this.terminalHeight + "px";
        document.getElementById("editCmd").style.height = this.cmdHeight + "px";
      }
    }
  }

  openEditModal(cmd, type) {
    this.submitted = false;
    this.showDescription = false;
    this.openEditCommand(cmd, type);
  }

  copyToTerminalFunc(editCmd, type, file) {
    this.copyToTerminal(editCmd, type, file);
    this.editCmd = ''
    document.getElementById("terminal").style.height = window.innerHeight - document.getElementById('deviceHeader').offsetHeight - 250 + 'px';
    document.getElementById("editCmd").style.height = '120px';
    this.terminalHeight = document.getElementById("terminal").offsetHeight;
    this.cmdHeight = document.getElementById("editCmd").offsetHeight;
  }
  emptyScriptDetail() {
    this.scriptDetail = false;
    this.scriptDetailModal = {
      title: '',
      type: '',
      command: '',
      default: false,
      id: '',
      category: '',
      categoryId: '',
      typeName: '',
      description: ''
    };
    this.cd.detectChanges();
  }
  copyScriptToggle(data, type) {
    this.runScript = !this.runScript;
    this.scriptDetail = !this.scriptDetail;
    this.submitted = false;
    this.openEditCommand(data, type);
  }
}