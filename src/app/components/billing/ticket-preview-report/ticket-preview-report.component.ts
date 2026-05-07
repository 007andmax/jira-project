import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TicketPreview } from './class/ticket-preview';

@Component({
  selector: 'app-ticket-preview-report',
  templateUrl: './ticket-preview-report.component.html',
  styleUrls: ['./ticket-preview-report.component.scss']
})
export class TicketPreviewReportComponent implements OnInit {

  list: Array<TicketPreview> = [];
  constructor(private peportsService: ReportsService) { }
  ngOnInit(): void {
    this.peportsService.getTicketPreivew().subscribe((res: any) => {
      this.list = res.map(item => new TicketPreview(item));
      console.log("this.list", this.list);
    })
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';

  }
  public trackById(index, item) {
    return item.id;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
