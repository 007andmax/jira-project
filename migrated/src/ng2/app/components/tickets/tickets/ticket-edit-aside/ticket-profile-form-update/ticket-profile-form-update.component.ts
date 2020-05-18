import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TicketProfileFormUpdate } from '../class/ticket-profile-form-update';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsListService } from '../../services/tickets-list.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TicketProfileFormUpdateProductsComponent } from './ticket-profile-form-update-products/ticket-profile-form-update-products.component';
import { TicketProfileFormUpdateServicesComponent } from './ticket-profile-form-update-services/ticket-profile-form-update-services.component';

@Component({
  selector: 'app-ticket-profile-form-update',
  templateUrl: './ticket-profile-form-update.component.html',
  styleUrls: ['./ticket-profile-form-update.component.scss'],
  providers: [TicketsListService]
})

export class TicketProfileFormUpdateComponent implements OnInit {
  ticketProfile: TicketProfile = new TicketProfile();
  ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @ViewChild('selectProducts') selectProducts: TicketProfileFormUpdateProductsComponent;
  @ViewChild('selectServices') selectServices: TicketProfileFormUpdateServicesComponent;
  @Input() lisUpdateUser: Array<CurrentUser> = [];
  @Input() set ticket(value) {
    this.ticketProfile = value;
    this.ticketProfileFormUpdate.setTicketId(this.ticketProfile.id);
    console.log("this.ticketProfileFormUpdate", this.ticketProfileFormUpdate);
  };
  showAddUpdateUser = false;
  isUpdate:boolean = false;
  isUpdateAndClose:boolean = false;
  files: any[] = [];
  tab: string = "NOTE";
  currentUser:CurrentUser;
  constructor(private ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,
    private usersStateService: UsersStateService,
    private ticketsService: TicketsService,
    private elRef: ElementRef,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
  }
  public onChangeChat(event) {
    this.ticketProfileFormUpdate.setChatMessage(event.target.value);

  }
  public onPastChat(value) {
    this.ticketProfileFormUpdate.setChatMessage(value);

  }
  public reset() {
    if (this.tab === "NOTE") this.elRef.nativeElement.querySelector("#chat").value = "";
    this.tab = "NOTE";
    this.files = [];
    this.showAddUpdateUser = false;



  }
  getUsersForUpdate() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.company.id === this.ticketProfile.companyId);
    return [...techusers, ...clientUsers];

  }
  update() {
    console.log("this.ticketProfileFormUpdate", this.ticketProfileFormUpdate);
    if (this.tab === "NOTE") {
      if (!this.ticketProfileFormUpdate.isValidateNote()) return;
      this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateNote());
      
    }
    if (this.tab === "PRODUCT") {
      this.onChangeProducts(this.selectProducts.getSelectedProducts());
      if (!this.ticketProfileFormUpdate.isValidateProduct()) return;
      this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateProduct());
     
    }
    if (this.tab === "SERVICE") {
      this.onChangeServices(this.selectServices.getSelectedServices());
      if (!this.ticketProfileFormUpdate.isValidateService()) return;
      this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateService());
      
    }

  }
  onUpdateTicket(data) {
    this.isUpdate = true;
    this.ticketsService.updateTicket(data).subscribe(data => {
      // this.ticketProfileFormUpdate.setChatMessage("");
      this.isUpdate = false;
      if (this.tab === "NOTE") {
        this.ticketProfileFormUpdate.setChatMessage("");
        this.elRef.nativeElement.querySelector("#chat").value = "";
      } else {
        this.ticketsStateService.onClearFormUpdate();
      }
    })
  }
  updateAndClose() {
    if (!this.checkUpdateAndClose()) return;
    console.log("updateAndClose");
    if (this.tab === "NOTE") {
      if (this.ticketProfileFormUpdate.isValidateNote())  {
        this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForUpdateNote());
       
      } else this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
    
    }
    if (this.tab === "PRODUCT") {
      this.onChangeProducts(this.selectProducts.getSelectedProducts());
      if (this.ticketProfileFormUpdate.isValidateProduct()) {
        this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForUpdateProduct());
      
      } else this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
    
    }
    if (this.tab === "SERVICE") {
      this.onChangeServices(this.selectServices.getSelectedServices());
      if (this.ticketProfileFormUpdate.isValidateServiceUpdateAndClose()) {
        this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForUpdateService());
       
      } else if (this.ticketProfileFormUpdate.isValidateService()) this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
     
    }
  }
  onUpdateTicketAndClose(data) {
    this.isUpdateAndClose = true;
    //
    this.ticketsService.updateTicket(data,true).subscribe(data => {
      // this.ticketProfileFormUpdate.setChatMessage("");
      this.isUpdateAndClose = false;
      if (this.tab === "NOTE") {
        this.ticketProfileFormUpdate.setChatMessage("");
        this.elRef.nativeElement.querySelector("#chat").value = "";
      } else {
        this.ticketsStateService.onClearFormUpdate();
      }
    
      
    })
  }
  private checkUpdateAndClose() {
    if (this.ticketProfile.updates.length === 0) return true;
    let completeServices = true;
    let completeProducts = true;
    this.ticketProfile.updates.forEach(update => {
     if (completeServices)   completeServices = (update.services.find(item => !item.completed) ? false : true);
     if (completeProducts)   completeProducts = (update.products.find(item => !item.completed) ? false : true);
    });

    return completeServices && completeProducts;
   
  }
  public setTab(data) {
    this.tab = data;
    this.ticketProfileFormUpdate.setType(data);
  }
  onChangeProducts(data) {
    this.ticketProfileFormUpdate.setProducts(data);
  }
  onChangeServices(data) {
    this.ticketProfileFormUpdate.setServices(data);
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
