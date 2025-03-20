import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('TicketDetailProfileEditUpdatesProductsComponent unit test', () => {
  let component: TicketDetailProfileEditUpdatesProductsComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NgbModule,
        NoopAnimationsModule],
      declarations: [TicketDetailProfileEditUpdatesProductsComponent
      ]
    }).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesProductsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.onChangeSaleProduct({ firstName: "test", lastName: "123" })).toEqual("test 123")
  });
});