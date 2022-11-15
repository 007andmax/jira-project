import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from '../app/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class ToastrProgressStateService {
  listToast = [];
  constructor(private toaster: ToastrService,
    private appStateService: AppStateService,) { }
  public onInit(id) {
    let toaster = this.toaster.info('The request is being processed', null, {
      timeOut: 0,
      progressBar: true,
      closeButton: false,
    });
    this.listToast.push({
      id: id,
      toastId: toaster.toastId
    })
    this.appStateService.changeDetectorRef();
  }
  public check(id) {
    return this.listToast.find(item => item.id == id);
  }
  public clear(id) {
    let index = this.listToast.findIndex(item => item.id == id);
    if (index > -1) {
      this.toaster.remove(this.listToast[index].toastId);
      this.listToast.splice(index, 1);
    }
  }
}
