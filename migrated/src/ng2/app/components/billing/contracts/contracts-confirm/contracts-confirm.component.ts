import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
 
@Component({
  selector: 'app-contracts-confirm',
  templateUrl: './contracts-confirm.component.html',
  styleUrls: ['./contracts-confirm.component.scss']
})
export class ContractsConfirmComponent implements OnInit {
  @Input() public message = '';
  constructor(private сontractsStateService: ContractsStateService,
    public activeModal: NgbActiveModal, private eRef: ElementRef, ) {
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

  cancelConfirm() {
    this.activeModal.close();
    this.сontractsStateService.setConfirm(false);
  };

  approveConfirm() {
    this.activeModal.close();
    this.сontractsStateService.setConfirm(true);
  };
}
