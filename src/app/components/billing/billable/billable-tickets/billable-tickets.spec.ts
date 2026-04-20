import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { BillableTicketsComponent } from './billable-tickets.component';



describe('BillableTicketsComponent unit test', () => {
  let component: BillableTicketsComponent;
  let fixture: ComponentFixture<BillableTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NumberModule,
        ToFixedModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, BillableTicketsComponent]
}).compileComponents();

  });

  it('check "parseTotal"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ selected: true, isOrder: true }, { selected: true, isOrder: false }] }
    expect(com.getSelectedCount()).toEqual(0);
    com.billableProfile = { tickets: [{ selected: true, isOrder: true }, { selected: true, isOrder: true }] }
    expect(com.getSelectedCount()).toEqual(2);
  });
  it('check "setSelectedTickets"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ id: "1", selected: false, isOrder: true }, { id: "2", selected: false, isOrder: false }] };
    com.setSelectedTickets(["1"])
    expect(com.billableProfile.tickets[0].selected).toEqual(true);
  });
  it('check "onToggleAll"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ selected: true, isOrder: true }, { selected: true, isOrder: false }] };
    com.onToggleAll({ target: { checked: false } });
    expect(com.billableProfile.tickets[0].selected).toEqual(false);
    expect(com.billableProfile.tickets[1].selected).toEqual(false);
  });
  it('check "onFilterSum"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ sum: 1 }, { sum: 5 }, { sum: 2 }] };
    com.onFilterSum();
    expect(com.billableProfile.tickets[0].sum).toEqual(1);
    expect(com.billableProfile.tickets[1].sum).toEqual(2);
    expect(com.billableProfile.tickets[2].sum).toEqual(5);
  });
  it('check "onFilterSubject"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ subject: "test 1" }, { subject: "test 3" }, { subject: "test 2" }] };
    com.onFilterSubject();
    expect(com.billableProfile.tickets[0].subject).toEqual("test 1");
    expect(com.billableProfile.tickets[1].subject).toEqual("test 2");
    expect(com.billableProfile.tickets[2].subject).toEqual("test 3");
  });
  it('check "onFilterTicketNumber"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ ticketNumber: 1 }, { ticketNumber: 5 }, { ticketNumber: 2 }] };
    com.onFilterTicketNumber();
    expect(com.billableProfile.tickets[0].ticketNumber).toEqual(1);
    expect(com.billableProfile.tickets[1].ticketNumber).toEqual(2);
    expect(com.billableProfile.tickets[2].ticketNumber).toEqual(5);
  });
  it('check "onFilterСlosedAt"', () => {
    const fixture = TestBed.createComponent(BillableTicketsComponent);
    const com = fixture.debugElement.componentInstance;
    com.billableProfile = { tickets: [{ closedAt: 1 }, { closedAt: 5 }, { closedAt: 2 }] };
    com.onFilterСlosedAt();
    expect(com.billableProfile.tickets[0].closedAt).toEqual(1);
    expect(com.billableProfile.tickets[1].closedAt).toEqual(2);
    expect(com.billableProfile.tickets[2].closedAt).toEqual(5);
  });
});