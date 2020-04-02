import { Component, OnInit } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpServices } from '../_services/common_http.service';
import { CommonServices } from '../_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})
export class SessionTimeoutComponent implements OnInit {

  constructor(private hardwareService: HardwareService, private toastr: ToastrService,
	             private commonHttpServices: CommonHttpServices, private commonServices: CommonServices, public modalRef: BsModalRef) {}

  ngOnInit() {
	
  }

  redirect() {
    window.location.href = 'https://dev.quicktech.com/signIn';
  }

}
