import { Component, OnInit } from '@angular/core';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';

@Component({
  selector: 'app-draft-email',
  templateUrl: './draft-email.component.html',
  styleUrls: ['./draft-email.component.scss']
})
export class DraftEmailComponent implements OnInit {
  opened = false;
  constructor(private draftEmailStateService:DraftEmailStateService) { }

  ngOnInit() {
    this.onShowAside();
  }
  public onShowAside() {
    this.draftEmailStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
    })
  }
}
