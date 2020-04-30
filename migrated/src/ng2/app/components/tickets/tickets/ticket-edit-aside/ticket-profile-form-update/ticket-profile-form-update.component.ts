import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TicketProfileFormUpdate } from '../class/ticket-profile-form-update';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsListService } from '../../services/tickets-list.service';

@Component({
  selector: 'app-ticket-profile-form-update',
  templateUrl: './ticket-profile-form-update.component.html',
  styleUrls: ['./ticket-profile-form-update.component.scss'],
  providers: [TicketsListService]
})

export class TicketProfileFormUpdateComponent implements OnInit {
  ticketProfile: TicketProfile = new TicketProfile();
  ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @Input() lisUpdateUser: Array<CurrentUser> = [];
  @Input() set ticket(value) {
    this.ticketProfile = value;
    this.ticketProfileFormUpdate.setTicketId(this.ticketProfile.id);
    console.log("this.ticketProfileFormUpdate", this.ticketProfileFormUpdate);
  };
  showAddUpdateUser = false;
  files: any[] = [];
  tab: string = "NOTE";
  constructor(private ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,
    private ticketsService: TicketsService,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
  }
  public onChangeChat(event) {
    this.ticketProfileFormUpdate.setChatMessage(event.target.value);
   
  }
  public onPastChat(value) {
    this.ticketProfileFormUpdate.setChatMessage(value);
   
  }
  update() {
    if (this.tab === "NOTE") {
      if (!this.ticketProfileFormUpdate.isValidateNote()) return;
      this.ticketsService.updateTicket(this.ticketProfileFormUpdate.getDataForUpdateNote()).subscribe(data => {
        this.ticketProfileFormUpdate.setChatMessage("");
      })
    }
    if (this.tab === "PRODUCT") {
      if (!this.ticketProfileFormUpdate.isValidateProduct()) return;
      this.ticketsService.updateTicket(this.ticketProfileFormUpdate.getDataForUpdateProduct()).subscribe(data => {
       // this.ticketProfileFormUpdate.setChatMessage("");
       this.ticketsStateService.onClearFormUpdate();
      })
    }

  }
  public setTab(data) {
    this.tab = data;
    this.ticketProfileFormUpdate.setType(data);
  }
  onChangeProducts(data) {
    this.ticketProfileFormUpdate.setProducts(data);
  }
  onToggleAddUpdateUser() {
    this.showAddUpdateUser = !this.showAddUpdateUser;
  }
  onSelectUpdateUser(data) {
    this.lisUpdateUser = data;
  }
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      return;
    } else {
      if (this.files[index].size > 4000000) {
        this.files[index].showError = true;
        this.uploadFilesSimulator(index + 1);
        return;
      }
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        // this.changeFile(file).then((base64: string): any => {
        console.log("res", res);
        this.ticketProfileFormUpdate.addFile(res.id);

        //   this.changeFiles.emit(this.idfiles);
        //  this.modalImageCropperStateService.onInitOpen(new ImageCroper(res.base64,res.id));

        //   const modalRef = this.modalService.open(ImageCropperComponent);
        //   modalRef.componentInstance.imageBase64 = res.base64;
        //   modalRef.componentInstance.id = res.id;
        this.uploadFilesSimulator(index + 1);
        this.cd.detectChanges();
        // });

      }).catch(() => {
        this.files[index].showError = true;
        this.uploadFilesSimulator(index + 1);
      });

    }

  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      //  var file = this.dataURLtoFile(this.img, this.fileName);

      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {

        resolve(xhr);

      }, false);

      xhr.upload.onprogress = (event) => {
        file.progress = Math.round((event.loaded / event.total) * 100);
        console.log('Загружено на сервер ' + event.loaded + ' байт из ' + event.total);
      }
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);


      xhr.open("POST", "/file?isAvatar=false");
      xhr.send(fd);
    });
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.ticketProfileFormUpdate.removeFile(index);

  }
  public trackByIndex(index, item) {
    return index;
  }
}
