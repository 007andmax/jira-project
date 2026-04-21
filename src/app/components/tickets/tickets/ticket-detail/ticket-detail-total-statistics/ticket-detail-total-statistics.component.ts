import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-ticket-detail-total-statistics',
  templateUrl: './ticket-detail-total-statistics.component.html',
  styleUrls: ['./ticket-detail-total-statistics.component.scss']
})
export class TicketDetailTotalStatisticsComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor() { }

  ngOnInit() {
  }
  getTotalWorked() {
    let timeInMinutes = this.ticketProfile.totalTimeWorked * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';

  }
}
