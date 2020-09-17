import { Component, OnInit ,ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';
import { WebsocketService } from 'src/ng2/app/services/websocket/websocket.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { UserListService } from '../../users/services/user-list.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserListService]
})
export class TerminalComponent implements OnInit {
  create = false;
  closeResult = '';
  submitted = false;
  loading = false;
  @ViewChild('commandFrm') form: any;
  commandModal = {
    title: '',
    command: '',
    category: '',
    categoryId: '',
    id: ''
  };
  myScriptModal = {
    category: '',
    categoryId: '',
    search: ''
  };
  sharedScriptModal = {
    category: '',
    categoryId: '',
    search: ''
  };
  scriptDetailModal = {
    title: '',
    type: '',
    command: '',
    default: false,
    id: ''
  };
  lineNumber = [1];
  lineNumberDetail = [1];
  deleteId = '';
  deleteTitle = '';
  command = '';
  commandList = [];
  myScriptList = [];
  myScriptListFilter = [];
  sharedScriptList = [];
  sharedScriptListFilter = [];
  historyList = [];
  cmdCategoryList = [];
  cmdCategoryReadList = [];
  runScript = false;
  scriptDetail = false;
  sessionId = '';
  finalCommand = '';
  splitCommand = [];
  @ViewChild('editor') editorElement:ElementRef;
  code = '';
  config = {
    lineNumbers: true,
    lineWrapping: true,
  };
  DateTimeHistoryFormat = CONFIGCONSTANTS.DateTimeHistoryFormat;
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private socketService: WebsocketService,
    private userListService: UserListService,
    public cd: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    // this.socketService.initializeWebSocketConnection();
    this.getCommandList();
    this.getCmdCategoryRead();
    this.getHistory();
    $('#cmd textarea').scroll(function(){
      $('#cmd_line').scrollTop($('#cmd textarea').scrollTop());
    });
    
  }

  getCommandList () {
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

  getHistory () {
    this.terminalService.getHistory(localStorage.getItem('agentId'))
    .pipe(first())
    .subscribe(data => {
      let obj = data[localStorage.getItem('agentId')]
      let arr = obj.split(/\r*\n/);
      let index = 0;
      let arr1 = [];
      
      arr.forEach(element => {
        if (Date.parse(element)) {
          if (index !== 0) {
            this.historyList.push(arr1);
            arr1 = [];
            index += 1;
          } else {
            index += 1;
          }
        }
        arr1.push(element);
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

  resetCmdModal() {
    this.commandModal = {
      title: '',
      command: '',
      category: '',
      categoryId: '',
      id: ''
    };
    this.command = '';
  }

  getCmdCategory () {
    this.loading = true;
    this.terminalService.getCmdCategory()
    .pipe(first())
    .subscribe(data => {
      this.loading = false;
      if (isArray(this.cmdCategoryList)) {
        this.cmdCategoryList = data;
      }
    },
    error => {
      this.loading = false;
      const statusError = error;
      if (statusError && statusError.meta) {
        this.toastr.error(statusError.meta.message);
      } else {
        this.toastr.error('Something went wrong please try again.');
      }
    });
  }

  getCmdCategoryRead () {
    
    this.terminalService.getCmdCategory()
    .pipe(first())
    .subscribe(data => {
      if (isArray(this.cmdCategoryReadList)) {
        this.cmdCategoryReadList = data;
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
    this.cmdCategoryList = [];
    this.getCmdCategory();
    this.modalService.open(template, {ariaLabelledBy: 'modal-basic-title' ,windowClass: 'cmn-terminal-modal category-modal confirm-control' , centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
    });
  }

  addNewCategory() {
    if (this.cmdCategoryList.length === 0 || (this.cmdCategoryList.length > 0 && (this.cmdCategoryList[this.cmdCategoryList.length - 1].create === undefined || this.cmdCategoryList[this.cmdCategoryList.length - 1].create === false))) {
      this.cmdCategoryList.push({id: '', name: '', create: true})
    }
  }

  deleteCategory(id, index) {
    this.terminalService.deleteCategory(id)
    .pipe(first())
    .subscribe(resp => {
        this.cmdCategoryList.splice(index, 1);
        this.toastr.success('Category Deleted Successfully');
    },
    error => {
      const statusError = error;
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
      const statusError = error;
    });
  }

  cancelCategory(flag) {
    if (flag === 'create') {
      this.cmdCategoryList.splice(this.cmdCategoryList.length - 1, 1);
    }
  }
  
  createCommand() {
    this.submitted = true;
    this.loading = true;
    if (this.form.invalid) {
      return;
    }
    let data = {
      title: this.commandModal.title,
      categoryId: this.commandModal.categoryId !== undefined ? this.commandModal.categoryId : this.cmdCategoryReadList.filter(val => val.name === this.commandModal.category)[0].id,
      command: this.commandModal.command,
      id: this.commandModal.id
    }
    if (this.commandModal.id == '') {
      delete data.id;
      this.terminalService.createCommand(data)
      .pipe(first())
      .subscribe(resp => {
        this.loading = false;
        if (resp.id !== '') {
          this.toastr.success('Command Created Successfully');
          this.create=!this.create;
          this.getCommandList();
        }
      },
      error => {
        const statusError = error;
        this.loading = false;
      });
    } else {
      this.terminalService.updateCommand(data)
      .pipe(first())
      .subscribe(resp => {
        this.loading = false;
        if (resp.id !== '') {
          this.toastr.success('Command Updated Successfully');
          this.create=!this.create;
          this.getCommandList();
        }
      },
      error => {
        const statusError = error;
        this.loading = false;
      });
    }
    
  }

  openEditCommand(data: any) {
    this.commandModal.title = data.title;
    this.commandModal.command = data.command;
    this.lineNumber = [];
    for (let index = 1; index <= data.command.split(/\r*\n/).length; index++) {
      this.lineNumber.push(index);
    }
    this.commandModal.id = data.id;
    this.commandModal.categoryId = data.cateogryId;
    let res = this.cmdCategoryReadList.filter(x => x.id == data.categoryId);
    this.commandModal.category = res[0].name;
    this.create = !this.create;
  }

  createCategory(data) {
    if (data.name == '') {
      return;
    }
    this.terminalService.createCategory({name: data.name})
    .pipe(first())
    .subscribe(resp => {
      if (resp.id !== '') {
        this.cmdCategoryList[this.cmdCategoryList.length - 1].create = false;
        this.cmdCategoryList[this.cmdCategoryList.length - 1].edit = false;
        this.toastr.success('Category Created Successfully');
        this.getCmdCategoryRead();
      }
    },
    error => {
      const statusError = error;
    });
  }

  updateCategory(data, index) {
    if (data.name == '') {
      return;
    }
    this.terminalService.updateCategory(data)
    .pipe(first())
    .subscribe(resp => {
      if (resp.id !== '') {
        this.cmdCategoryList[index].edit = false;
        this.toastr.success('Category Updated Successfully');
        this.getCmdCategoryRead();
      }
    },
    error => {
      const statusError = error;
    });
  }

 
  
 
  openModal(template, id, title, flag) {
    if (flag === 'deleteCmd') {
      this.deleteId = id;
      this.deleteTitle = title;
    }
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

  filterMyScript(category: any) {
    if (category !== undefined) {
      this.myScriptModal.category = category.name;
      this.myScriptModal.categoryId = category.id;
    }
    if (this.myScriptModal.search === '' && this.myScriptModal.category === '') {
      this.myScriptListFilter = this.myScriptList;
    } else if (this.myScriptModal.category !== '' && this.myScriptModal.search !== '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.title.toLowerCase().includes(this.myScriptModal.search.toLowerCase()) && val.categoryId === this.myScriptModal.categoryId);
    } else if (this.myScriptModal.search !== '' && this.myScriptModal.category === '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.title.toLowerCase().includes(this.myScriptModal.search.toLowerCase()))
    } else if (this.myScriptModal.search === '' && this.myScriptModal.category !== '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.categoryId === this.myScriptModal.categoryId)
    }
  }

  filterSharedScript(category: any) {
    if (category !== undefined) {
      this.sharedScriptModal.category = category.name;
      this.sharedScriptModal.categoryId = category.id;
    }
    if (this.sharedScriptModal.search === '' && this.sharedScriptModal.category === '') {
      this.sharedScriptListFilter = this.sharedScriptList;
    } else if (this.sharedScriptModal.category !== '' && this.sharedScriptModal.search !== '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.title.toLowerCase().includes(this.sharedScriptModal.search.toLowerCase()) && val.categoryId === this.sharedScriptModal.categoryId);
    } else if (this.sharedScriptModal.search !== '' && this.sharedScriptModal.category === '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.title.toLowerCase().includes(this.sharedScriptModal.search.toLowerCase()))
    } else if (this.sharedScriptModal.search === '' && this.sharedScriptModal.category !== '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.categoryId === this.sharedScriptModal.categoryId)
    }
  }

  openRunScript () {
    this.runScript = !this.runScript;
    if (this.runScript === true) {
      this.myScriptListFilter = this.myScriptList;
      this.sharedScriptListFilter = this.sharedScriptList;
    }
    this.myScriptModal = {
      category: '',
      categoryId: '',
      search: ''
    }
    this.sharedScriptModal = {
      category: '',
      categoryId: '',
      search: ''
    }
  }

  countLineNumber() {
    var text = $("#cmd textarea").val().toString();   
    var lines = text.split(/\r*\n/);
    var count = lines.length;
    this.lineNumber = [];
    for (let index = 0; index < count; index++) {
      this.lineNumber[index] = index + 1;
    }
    $('#cmd_line').scrollTop($('#cmd textarea').scrollTop());
  }

  countLineNumberDetail() {
    var text = $("#cmd_detail textarea").val().toString();   
    var lines = text.split(/\r*\n/);
    var count = lines.length;
    this.lineNumberDetail = [];
    for (let index = 0; index < count; index++) {
      this.lineNumberDetail[index] = index + 1;
    }
    $('#cmd_detail_line').scrollTop($('#cmd_detail textarea').scrollTop());
  }

  viewScriptDetail(data) {
    this.scriptDetail = !this.scriptDetail;
    this.scriptDetailModal = data;
    this.lineNumberDetail = [];
    for (let index = 1; index <= data.command.split(/\r*\n/).length; index++) {
      this.lineNumberDetail.push(index);
    }
  }

  copyToTerminal(cmd) {
    if (JSON.parse(localStorage.getItem('deviceDetail')).online === true) {
      this.finalCommand = cmd;
      let arr = cmd.split(/\r*\n/)
      this.splitCommand = this.splitCommand.concat(arr);
      this.sessionId = localStorage.getItem('uuid');
      this.sendCommand();
    } else {
      this.toastr.error('The device is offline');
    }
    
  }

  sendCommand() {
    let data = {
      "companyId": localStorage.getItem('company_id'),
      "agentId": localStorage.getItem('agentId'),
      "sessionId": this.sessionId,
      "scriptType": "cmd", // 'powershell'
      "script": this.finalCommand,
      "file": this.splitCommand.length > 1 ? true : false,
      "keepOpen": true
    }

    this.terminalService.sendCommand(data)
    .pipe(first())
    .subscribe(resp => {
      let stompClient = this.socketService.getClient().subscribe(`/user/watch/cmdShellOutput`, (message) => {
        var newChange = JSON.parse(message.body);
        let arr = newChange.data.output.split(/\r*\n/)
        let arr1 = this.splitCommand.concat(arr);
        this.splitCommand = arr1;
        this.cd.detectChanges();
      });
      this.userListService.addSubscription(stompClient);
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


}
