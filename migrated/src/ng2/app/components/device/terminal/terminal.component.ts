import { Component, OnInit ,ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/ng2/app/services/websocket/websocket.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { UserListService } from '../../users/services/user-list.service';
import { CompaniesRealTimeService } from 'src/ng2/app/states/company/companies-real-time.service';
import { ShellStateService } from 'src/ng2/app/states/shell/shell-state.service';
import { command, script, commandModal, scriptModal } from './../class/device';

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
  his = '';
  sub: Subscription = new Subscription();
  @ViewChild('commandFrm') form: any;
  commandModal: commandModal = {
    title: '',
    command: '',
    category: '',
    categoryId: '',
    id: '',
    type: '',
    typeName: '',
    description: ''
  };
  myScriptModal: scriptModal = {
    category: '',
    categoryId: '',
    search: ''
  };
  sharedScriptModal: scriptModal = {
    category: '',
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
  splitCommand = ["C:\\>"];
  scriptTyped = 'cmd';
  showDescription = false;
  terminalHeight = 0;
  cmdHeight = 0;
  @ViewChild('editor') editorElement:ElementRef;
  code = '';
  config = {
    lineNumbers: true,
    lineWrapping: true,
  };
  terminalHit = false;
  DateTimeHistoryFormat = CONFIGCONSTANTS.DateTimeHistoryFormat;
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private socketService: WebsocketService,
    private userListService: UserListService,
    private companiesRealTimeService: CompaniesRealTimeService,
    private shellStateService: ShellStateService,
    public cd: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    
    // this.socketService.initializeWebSocketConnection();
    this.getCommandList();
    this.getCmdCategoryRead();
    this.getHistory();
    // this.socketService.subsribeToCmdShellOutput();
    $('#cmd textarea').scroll(function(){
      $('#cmd_line').scrollTop($('#cmd textarea').scrollTop());
    });
    document.getElementById("terminal").style.height = window.innerHeight - document.getElementById('deviceHeader').offsetHeight - 250 + 'px';
    this.terminalHeight = document.getElementById("terminal").offsetHeight;
    this.cmdHeight = document.getElementById("editCmd").offsetHeight;
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
      if (Object.keys(data).length > 0) {
      let obj = data[localStorage.getItem('agentId')]
      this.his = obj;
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

  resetCmdModal() {
    this.commandModal = {
      title: '',
      command: '',
      category: '',
      categoryId: '',
      id: '',
      type: '',
      typeName: '',
      description: ''
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
      id: this.commandModal.id,
      type: this.commandModal.type,
      description: this.commandModal.description
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

  openEditCommand(data: any, flag: string) {
    this.commandModal.title = data.title;
    this.commandModal.type = data.type;
    this.commandModal.description = data.description;
    this.commandModal.command = data.command;
    this.lineNumber = [];
    for (let index = 1; index <= data.command.split(/\r*\n/).length; index++) {
      this.lineNumber.push(index);
    }
    if (flag === 'copy') {
      this.commandModal.id = '';
    } else {
      this.commandModal.id = data.id;
    }
    this.commandModal.categoryId = data.categoryId;
    if(this.commandModal.type === 'CMD') {
      this.commandModal.typeName = 'Command Line'
    } else if(this.commandModal.type === 'POWERSHELL') {
      this.commandModal.typeName = 'Powershell'
    }
    let res = this.cmdCategoryReadList.filter(x => x.id == data.categoryId);
    this.commandModal.category = res.length > 0 ? res[0].name : '';
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
    } else {
      this.myScriptModal.category = '';
      this.myScriptModal.categoryId = '';
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
    } else {
      this.sharedScriptModal.category = '';
      this.sharedScriptModal.categoryId = '';
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
    this.showDescription = false;
    this.scriptDetailModal = data;
    this.lineNumberDetail = [];
    for (let index = 1; index <= data.command.split(/\r*\n/).length; index++) {
      this.lineNumberDetail.push(index);
    }
    this.scriptDetailModal.id = data.id;
    this.scriptDetailModal.categoryId = data.categoryId;
    if(this.scriptDetailModal.type === 'CMD') {
      this.scriptDetailModal.typeName = 'Command Line'
    } else if(this.scriptDetailModal.type === 'POWERSHELL') {
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
    if (JSON.parse(localStorage.getItem('deviceDetail')).online === true) {
      this.finalCommand = cmd;
      // let arr = cmd.split(/\r*\n/)
      // this.splitCommand[this.splitCommand.length - 1] = this.splitCommand[this.splitCommand.length - 1] + arr[0];
      // if (arr.splice(0, 1).length > 0) {
      //   this.splitCommand = this.splitCommand.concat(arr.splice(0, 1));
      // }
      this.sessionId = localStorage.getItem('uuid');
      this.sendCommand(type, file);
    } else {
      this.toastr.error('The device is offline');
    }
    
  }

  sendCommand(type, file) {
    let data: command = {
      "companyId": localStorage.getItem('company_id'),
      "agentId": localStorage.getItem('agentId'),
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
          let arr = data.data.output.split(/\r*\n/)
          let arr1 = this.splitCommand.concat(arr);
          this.splitCommand = arr1;
          this.cd.detectChanges();
          setTimeout(() => {
            $('#terminal').scrollTop($('#terminal')[0].scrollHeight);
          }, 50);
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

  updateMyScript() {
    let id = '';
    let arr = this.cmdCategoryReadList.filter(val => val.name === this.scriptDetailModal.category);
    if (arr.length > 0) {
      id = arr[0].id;
    }
    if (id !== '') {
      let data = {
        title: this.scriptDetailModal.title,
        categoryId: this.scriptDetailModal.categoryId !== undefined ? this.scriptDetailModal.categoryId : id,
        command: this.scriptDetailModal.command,
        id: this.scriptDetailModal.id,
        type: this.scriptDetailModal.type,
        description: this.scriptDetailModal.description
      }
      this.terminalService.updateCommand(data)
      .pipe(first())
      .subscribe(resp => {
        this.loading = false;
        if (resp.id !== '') {
          this.toastr.success('Command Updated Successfully');
          this.scriptDetail=!this.scriptDetail;
          this.getCommandList();
        }
      },
      error => {
        const statusError = error;
        this.loading = false;
      });
    }
  }
  setHeight(flag) {
    if(flag === 'enter' && document.getElementById("editCmd").offsetHeight < 280 ) {
      document.getElementById("terminal").style.height = (document.getElementById("terminal").offsetHeight - 10) + "px";
      document.getElementById("editCmd").style.height = (document.getElementById("editCmd").offsetHeight + 10) + "px";
    } else if(flag === 'backspace'){
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

  openAddModal() {
    this.resetCmdModal();
    this.submitted = false;
    this.create = !this.create;
    this.showDescription = false;
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

  toggleTerminal(type, typeName) {
    this.commandModal.type = type; 
    this.commandModal.typeName = typeName; 
  }

  toggleDetailTerminal(type, typeName) {
    this.scriptDetailModal.type = type; 
    this.scriptDetailModal.typeName = typeName; 
  }

  emptyScriptDetail() {
    this.scriptDetail = !this.scriptDetail;
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
  }

  setScriptDetail(name, id) {
    this.scriptDetailModal.category = name;
    this.scriptDetailModal.categoryId = id;
  }

  setCommand(name, id) {
    this.commandModal.category = name;
    this.commandModal.categoryId = id;
  }

  copyScriptToggle(data, type) {
    this.runScript = !this.runScript;
    this.scriptDetail = !this.scriptDetail;
    this.submitted = false;
    this.openEditCommand(data, type);
  }
}
