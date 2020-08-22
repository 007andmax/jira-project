import { Component, OnInit ,ViewEncapsulation, ViewChild, ElementRef  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';
import 'codemirror/mode/clike/clike';


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
  loading = false;
  @ViewChild('commandFrm') form: any;
  commandModal = {
    title: '',
    command: '',
    category: '',
    categoryId: '',
    id: ''
  };
  deleteId = '';
  deleteTitle = '';
  command = '';
  commandList = [];
  historyList = [];
  cmdCategoryList = [];
  cmdCategoryReadList = [];
  runScript = false;
  scriptDetail = false;
  @ViewChild('editor') editorElement:ElementRef;
  code = '';
  config = {
    lineNumbers: true,
    lineWrapping: true,
  };
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,
    private modalService: NgbModal  
    ) { }

  ngOnInit() {
    this.getCommandList();
    this.getCmdCategoryRead();
    this.getHistory();
  }

  getCommandList () {
    this.terminalService.getCommand()
    .pipe(first())
    .subscribe(data => {
      if (isArray(this.commandList)) {
        this.commandList = [];
        let response = data;
        for (let key in response) {
          response[key].forEach(element => {
            this.commandList.push(element);  
          });
          
        }
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
    document.querySelectorAll('.CodeMirror-line span').forEach(element => {
      element.innerHTML = '';
    });
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
    if (this.form.invalid) {
      return;
    }
    let data = {
      title: this.commandModal.title,
      categoryId: this.commandModal.categoryId,
      command: this.commandModal.command,
      id: this.commandModal.id
    }
    if (this.commandModal.id == '') {
      delete data.id;
      this.terminalService.createCommand(data)
      .pipe(first())
      .subscribe(resp => {
        if (resp.id !== '') {
          this.toastr.success('Command Created Successfully');
          this.create=!this.create;
          this.getCommandList();
        }
      },
      error => {
        const statusError = error;
        
      });
    } else {
      this.terminalService.updateCommand(data)
      .pipe(first())
      .subscribe(resp => {
        if (resp.id !== '') {
          this.toastr.success('Command Updated Successfully');
          this.create=!this.create;
          this.getCommandList();
        }
      },
      error => {
        const statusError = error;
        
      });
    }
    
  }

  openEditCommand(data: any) {
    this.commandModal.title = data.title;
    this.commandModal.command = data.command;
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


}
