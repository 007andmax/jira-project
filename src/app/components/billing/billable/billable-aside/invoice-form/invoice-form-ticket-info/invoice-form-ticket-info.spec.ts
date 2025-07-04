import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { InvoiceFormTicketInfoComponent } from './invoice-form-ticket-info.component';

describe('InvoiceFormTicketInfoComponent unit test', () => {
  let component: InvoiceFormTicketInfoComponent;
  let fixture: ComponentFixture<InvoiceFormTicketInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NumberModule,
        NgbModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoiceFormTicketInfoComponent
      ]
    }).compileComponents();

  });

  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02 : 00");
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "name", rate: 10 }])).toEqual("name 10%");
  });
});