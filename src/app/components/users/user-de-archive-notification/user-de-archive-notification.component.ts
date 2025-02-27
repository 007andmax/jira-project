import { Component, Input, OnInit } from '@angular/core';
import { User } from '../class/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';

@Component({
  selector: 'app-user-de-archive-notification',
  templateUrl: './user-de-archive-notification.component.html',
  styleUrls: ['./user-de-archive-notification.component.scss']
})
export class UserDeArchiveNotificationComponent implements OnInit {
  @Input() user: User;
  @Input() message: string;
  constructor(private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
}
