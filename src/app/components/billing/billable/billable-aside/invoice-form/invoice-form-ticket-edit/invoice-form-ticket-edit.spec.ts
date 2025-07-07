import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { InvoiceFormTicketEditComponent } from './invoice-form-ticket-edit.component';

describe('InvoiceFormTicketEditComponent unit test', () => {
  let component: InvoiceFormTicketEditComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditComponent>;

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
      declarations: [InvoiceFormTicketEditComponent
      ]
    }).compileComponents();

  });

  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(InvoiceFormTicketEditComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02:00 hr(s)");
  });
});