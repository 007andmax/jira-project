import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardTicketsStats } from '../class/dashboard-tickets-stats';
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { StatusColor } from '../../class/status-color';

@Component({
  selector: 'app-ticket-priority-widget',
  templateUrl: './ticket-priority-widget.component.html',
  styleUrls: ['./ticket-priority-widget.component.scss']
})
export class TicketPriorityWidgetComponent implements OnInit {
  @Input() dashboardTicketsStats: DashboardTicketsStats = new DashboardTicketsStats();
  @ViewChild('nvd3', { static: true }) nvd3: any;
  @Input() ticketsPriorities: Array<TicketsPriority> = [];
  toggleAllPriorities: boolean = false;
  statusColors: Array<StatusColor> = [];
  chartOptions: any;
  chartColors = { domain: ["#0646a4", "#00ccff", '#2bc7c6'] };
  data: any;
  constructor(private ticketsStateService: TicketsStateService,
    private leftPanelService: LeftPanelService) { }

  ngOnInit() {

    this.getColors();
  }
  private initChart() {
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 180,
        width: 180,
        margin: {
          top: -5,
          right: -5,
          bottom: -5,
          left: -5
        },
        valueFormat: (n) => {
          return n;
        },
        donut: true,
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          let priority = this.ticketsPriorities.find(item => item.name == d.label);
          return this.statusColors[priority.color].textColor
        },
        showLegend: false,
        duration: 500,

        donutRatio: '0.68'
      }
    }
  }
  customColors = (d: any, i: any) => {
    console.log("d", d);
    console.log("i", i);
    let priority = this.ticketsPriorities.find(item => item.name == d);
    return priority ? this.statusColors[priority.color].textColor : '#0646a4';
  }
  getColors() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.statusColors = data.map(item => new StatusColor(item.borderColor, item.textColor))
        this.ticketsStateService.onColorStatus(this.statusColors);
        this.initChart();
      })

    } else {
      this.statusColors = this.ticketsStateService.getListStatusColor();
      this.initChart();
    }
  }
  setDataForChart() {
    this.data = [];
    this.ticketsPriorities.forEach(item => {
      this.data.push({
        "name": item.name,
        "value": this.dashboardTicketsStats.counts[item.getNameForCounts()]
      })
    })
  }
  public updateDataChart() {
    this.setDataForChart();
    //  if (this.nvd3.char) this.nvd3.chart.update();
  }
  public trackById(index, item) {
    return item.id;
  }
  getTotal() {
    return this.ticketsPriorities.reduce((partialSum, a) => partialSum + this.dashboardTicketsStats.counts[a.getNameForCounts()], 0);
  }
}
