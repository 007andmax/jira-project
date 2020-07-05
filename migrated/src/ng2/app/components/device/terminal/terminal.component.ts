import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TerminalComponent implements OnInit {
  create = false;
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllTerminalList();
  }

  getAllTerminalList () {
    this.terminalService.getAllTerminalList()
    .pipe(first())
    .subscribe(data => {
    },
    error => {
    });
  }



}
