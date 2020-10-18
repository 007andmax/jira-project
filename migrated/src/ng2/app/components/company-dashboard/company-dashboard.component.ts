import { NgModule, ViewChild } from '@angular/core';
import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import {NgbDropdownToggle,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TicketProfileFormService } from '../../../../ng2/app/components/tickets/tickets/ticket-edit-aside/class/ticket-profile-form-service';
import { TicketProfileUpdatesServiceTimepickerComponent } from '../../components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';
declare let d3: any;
@Component({
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@NgModule({
  imports: [NgbDropdownToggle,NgbModal]  
})
export class CompanyDashboardComponent implements OnInit {
  @ViewChild('timePicker1') timePicker1: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker2') timePicker2: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker3') timePicker3: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker4') timePicker4: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker5') timePicker5: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker6') timePicker6: TicketProfileUpdatesServiceTimepickerComponent;
  @ViewChild('timePicker7') timePicker7: TicketProfileUpdatesServiceTimepickerComponent;
  currentService: TicketProfileFormService = new TicketProfileFormService();
  chartOptions: any;
  lineChartOptions: any;
  data: any;
  lineData: any;
  chartColors = ["#0646a4", "#00ccff", '#2bc7c6'];
  constructor(private modalService: NgbModal) {}
  closeResult = '';

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }
  openMap(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',centered: true , windowClass: 'cmp-comapny-modal map'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

  ngOnInit() {
    this.currentService = new TicketProfileFormService();
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 200,
        donut: true,
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          return this.chartColors[i]
        },
        showLegend: false,
        duration: 500,
        legend: {
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        donutRatio: '0.68'
      }
    }
    this.lineChartOptions = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]/100; },
        average: function(d) { return d.mean/100; },

        duration: 300,
        useInteractiveGuideline: true,
        clipVoronoi: true,

        xAxis: {
            axisLabel: 'X Axis',
            tickFormat: function(d) {
                return d3.time.format('%m/%d/%y')(new Date(d))
            },
            showMaxMin: false,
            staggerLabels: true
        },

        yAxis: {
            axisLabel: 'Y Axis',
            tickFormat: function(d){
                return d3.format(',.1%')(d);
            },
            axisLabelDistance: 20
        }
      }
    }
    this.data = [ 
        {
          "label" : "B" ,
          "value" : 8
        } ,
        {
          "label" : "C" ,
          "value" : 32
        } ,
        {
          "label" : "D" ,
          "value" : 60
        }
    ];
    this.lineData = [
      {
          key: "Long",
          values: [ [ 1083297600000 , -2.974623048543] , 
          [ 1085976000000 , -1.7740300785979] , 
          [ 1088568000000 , 4.4681318138177] , 
          [ 1091246400000 , 7.0242541001353] , 
          [ 1093924800000 , 7.5709603667586] , 
          [ 1096516800000 , 20.612245065736]]
          ,
          mean: 250
      },
      {
          key: "Short",
          values: [ [ 1083297600000 , -0.77078283705125] , 
          [ 1085976000000 , -1.8356366650335] , 
          [ 1088568000000 , -5.3121322073127] , 
          [ 1091246400000 , -4.9320975829662] , 
          [ 1093924800000 , -3.9835408823225] , 
          [ 1096516800000 , -6.8694685316805]]
          ,
          mean: -60
      },


      {
          key: "Gross",
          mean: 125,
          values: [ [ 1083297600000 , -3.7454058855943] , 
          [ 1085976000000 , -3.6096667436314] , 
          [ 1088568000000 , -0.8440003934950] , 
          [ 1091246400000 , 2.0921565171691] , 
          [ 1093924800000 , 3.5874194844361] , 
          [ 1096516800000 , 13.742776534056] ]
      }
  ];
  } 

  public onChangeStartTimePicker(data) {
    this.currentService.setDurationStart(data);
  }

  public onChangeEndTimePicker(data) {
    this.currentService.setDurationEnd(data);
  }

}
