import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { DashboardBillingComponent } from './dashboard-billing.component';


describe('DashboardBillingComponent unit test', () => {
  let component: DashboardBillingComponent;
  let fixture: ComponentFixture<DashboardBillingComponent>;

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
      declarations: [DashboardBillingComponent
      ]
    }).compileComponents();

  });


  it('check "getDataForChart"', () => {
    const fixture = TestBed.createComponent(DashboardBillingComponent);
    const com = fixture.debugElement.componentInstance;
    com.checkReadyState();
    expect(com.showPreloader).toEqual(true);
  });
});