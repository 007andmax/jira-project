import { Component, Input, OnInit } from '@angular/core';
import { commandModal } from '../../class/device';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TerminalManageCategoryComponent } from '../terminal-manage-category/terminal-manage-category.component';

@Component({
  selector: 'terminal-aside',
  templateUrl: './terminal-aside.component.html',
  styleUrls: ['./terminal-aside.component.scss']
})
export class TerminalAsideComponent implements OnInit {
  create = false;
  submitted = false;
  showDescription = false;
  scriptDetail = false;
  lineNumber = [1];
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
  commandList = [];
  cmdCategoryReadList = [];
  @Input() copyToTerminal: Function;
  @Input() openEditModal: Function;
  @Input() openModal: Function;
  constructor(private modalService: NgbModal,) { }

  ngOnInit() {
  }
  /* toggleTerminal(type, typeName) {
     this.commandModal.type = type;
     this.commandModal.typeName = typeName;
   }
   openAddModal() {
     this.resetCmdModal();
     this.submitted = false;
     this.create = !this.create;
     this.showDescription = false;
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
   setCommand(name, id) {
     this.commandModal.category = name;
     this.commandModal.categoryId = id;
   }
   manageCategory() {
     const modalRef = this.modalService.open(TerminalManageCategoryComponent, { windowClass: 'quote-send-modal page-settings', backdrop: 'static', keyboard: false });
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
   createCommand() {
     this.submitted = true;
     if (this.form.invalid) {
       return;
     }
     this.loading = true;
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
             this.create = !this.create;
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
             this.create = !this.create;
             this.getCommandList();
           }
         },
           error => {
             const statusError = error;
             this.loading = false;
           });
     }
 
   }*/
}
