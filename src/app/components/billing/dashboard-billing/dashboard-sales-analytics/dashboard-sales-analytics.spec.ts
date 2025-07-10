import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DashboardSalesAnalyticsComponent } from './dashboard-sales-analytics.component';


describe('DashboardSalesAnalyticsComponent unit test', () => {
  let component: DashboardSalesAnalyticsComponent;
  let fixture: ComponentFixture<DashboardSalesAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [DashboardSalesAnalyticsComponent
      ]
    }).compileComponents();

  });


  it('check "getDataForChart"', () => {
    const fixture = TestBed.createComponent(DashboardSalesAnalyticsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDataForChart()).toEqual([
      {
        series: [],      //values - represents the array of {x,y} data points
        name: 'Sales', //key  - the name of the series.
      },
      {
        series: [],      //values - represents the array of {x,y} data points
        name: 'Revenue', //key  - the name of the series.
      },
    ]);
  });

  it('check "selectType"', () => {
    const fixture = TestBed.createComponent(DashboardSalesAnalyticsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDataForChart()).toEqual([
      {
        series: [],      //values - represents the array of {x,y} data points
        name: 'Sales', //key  - the name of the series.
      },
      {
        series: [],      //values - represents the array of {x,y} data points
        name: 'Revenue', //key  - the name of the series.
      },
    ]);
  });
});