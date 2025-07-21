import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DashboardQuotesComponent } from './dashboard-quotes.component';
import { DashboardSaleQuoteCounters } from '../class/dashboard-sale-quote-counters';


describe('DashboardQuotesComponent unit test', () => {
  let component: DashboardQuotesComponent;
  let fixture: ComponentFixture<DashboardQuotesComponent>;

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
      declarations: [DashboardQuotesComponent
      ]
    }).compileComponents();

  });


  it('check "getProcent"', () => {
    const fixture = TestBed.createComponent(DashboardQuotesComponent);
    const com = fixture.debugElement.componentInstance;
    com.stats = new DashboardSaleQuoteCounters();
    expect(com.getProcent(100)).toEqual(Infinity);
  });
});