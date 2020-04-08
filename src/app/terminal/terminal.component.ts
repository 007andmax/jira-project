import { Component, OnInit } from '@angular/core';
import { TerminalService } from '../_services/terminal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
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
