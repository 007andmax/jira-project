import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { commandModal } from '../../class/device';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TerminalManageCategoryComponent } from '../terminal-manage-category/terminal-manage-category.component';
import { TerminalService } from '../../_services/terminal.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TerminalValidate } from '../class/terminal-validate';
import { CONFIGCONSTANTS } from '../../config/app-constants';

@Component({
  selector: 'terminal-aside',
  templateUrl: './terminal-aside.component.html',
  styleUrls: ['./terminal-aside.component.scss']
})
export class TerminalAsideComponent implements OnInit {
  DateTimeHistoryFormat = CONFIGCONSTANTS.DateTimeHistoryFormat;
  create = false;
  @Input() submitted = false;
  @Input() showDescription = false;
  lineNumber = [1];
  commandModal: commandModal = {
    title: '',
    command: '',
    category: '',
    categoryId: '',
    id: '',
    type: '',
    description: ''
  };
  @Input() commandList = [];
  @Input() cmdCategoryReadList = [];
  historyList = [];
  scriptTypes = [new CompanySetting('Command Line', 'CMD'),
  new CompanySetting('Powershell', 'POWERSHELL')];
  his = '';
  @ViewChild('commandFrm') form: any;
  @Input() loading: boolean;
  @Input() _id: string = '';
  validate: TerminalValidate = new TerminalValidate();
  @Input() openEditModal: Function;
  @Input() getCommandList: Function;
  @Output() onCopyToTerminal = new EventEmitter();
  @Output() onOpenRunScript = new EventEmitter();
  @Output() onOpenModal = new EventEmitter();
  @ViewChild('scriptType') scriptType: DropDownComponent;
  @ViewChild('selectCategory') selectCategory: DropDownComponent;

  constructor(private modalService: NgbModal,
    private toastr: ToastrService,
    private terminalService: TerminalService,) { }

  ngOnInit() {
    this.getHistory();
  }
  copyToTerminal(cmd, type, file) {
    this.onCopyToTerminal.emit({ cmd, type, file })
  }
  openRunScript() {
    this.onOpenRunScript.emit(null);
  }
  openModal(id, title, flag) {
    this.onOpenModal.emit({ id, title, flag })
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
    this.scriptType.selectItemWithOutChanges(this.scriptTypes.find(item => item.value == this.commandModal.type));
    let res = this.cmdCategoryReadList.filter(x => x.id == data.categoryId);
    if (res.length > 0) this.selectCategory.selectItemWithOutChanges(res[0]);
    this.create = !this.create;
  }
  toggleTerminal(data) {
    this.commandModal.type = data.value;
    this.validate.resetType();
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
      description: ''
    };
    // this.command = '';
  }
  getHistory() {
    this.terminalService.getHistory(this._id)
      .pipe(first())
      .subscribe(data => {
        if (Object.keys(data).length > 0) {
          let obj = data[this._id]
          this.his = obj;
          let arr = obj.split('↵');
          if (arr.length == 1) {
            arr = obj.split(/\r*\n/);
          }
          let index = 0;
          let arr1 = [];

          arr.forEach((element, index) => {
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
            if (index === arr.length - 1) {
              this.historyList.push(arr1);
            }
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

  setCommand(data) {
    this.commandModal.category = data.name;
    this.commandModal.categoryId = data.id;
    this.validate.resetCategory();
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
    if (!this.validate.isValidate(this.commandModal)) return;
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

  }
}
