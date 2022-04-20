import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { InventoryItem } from '../class/inventory-item';

@Component({
  selector: 'inventory-modal-remove',
  templateUrl: './inventory-modal-remove.component.html',
  styleUrls: ['./inventory-modal-remove.component.scss']
})
export class InventoryModalRemoveComponent implements OnInit {
  @Input() inventory: InventoryItem;

  constructor(private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,
    private eRef: ElementRef,) {

  }

  ngOnInit() {

  }

  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);


  };

  approveConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(true);


  };


}
