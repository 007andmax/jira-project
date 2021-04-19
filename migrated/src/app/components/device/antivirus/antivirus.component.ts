import { Component, OnInit } from '@angular/core';
import { AntivirusService } from '../_services/antivirus.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-antivirus',
  templateUrl: './antivirus.component.html',
  styleUrls: ['./antivirus.component.scss']
})
export class AntivirusComponent implements OnInit {

  constructor(private antivirusService: AntivirusService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

    getAntivirusList () {
    this.antivirusService.getAllAntivirusList ()
    .pipe(first())
    .subscribe(resp => {
    },
    error => {
    });
  }

}
