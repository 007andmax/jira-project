import { Component, OnInit } from '@angular/core';
import { DeviceServices } from '../_services/device_services.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(private deviceServices: DeviceServices,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  getAllServicesList () {
    this.deviceServices.getAllServicesList()
    .pipe(first())
    .subscribe(resp => {
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

}
