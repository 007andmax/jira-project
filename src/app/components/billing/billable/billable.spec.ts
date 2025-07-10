import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { BillableRoutingModule } from './billable-routing.module';
import { BillableComponent } from './billable.component';



describe('BillableComponent unit test', () => {
  let component: BillableComponent;
  let fixture: ComponentFixture<BillableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        BillableRoutingModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        FormsModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [BillableComponent
      ]
    }).compileComponents();

  });

  it('check "isExistSelected"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.reqList = [{ selected: true, isOrder: true }, { selected: false, isOrder: false }];
    expect(com.isExistSelected()).toEqual({ selected: true, isOrder: true });
  });
  it('check "onSelectItem"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.reqList = [{ id: 1, selected: true, isOrder: true }, { id: 2, selected: false, isOrder: false }];
    com.onSelectItem(false, { id: 1 });
    expect(com.reqList[0].selected).toEqual(false);
  });
  it('check "onToggleAll"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.reqList = [{ id: 1, selected: true, isOrder: true }, { id: 2, selected: false, isOrder: false }];
    com.onToggleAll({ target: { checked: false } });
    expect(com.reqList[0].selected).toEqual(false);
    expect(com.reqList[1].selected).toEqual(false);
  });
  it('check "getCounters"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.list = [{ isDefault: true, tickets: [{ id: 1 }, { id: 2 }, { id: 3 }] }, { isDefault: false, tickets: [{ id: 1 }, { id: 2 }, { id: 3 }] }];
    com.getCounters();
    expect(com.count).toEqual(3);
  });
  it('check "onFilterTotal"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.list = [{ total: 3 }, { total: 2 }, { total: 1 }];
    com.onFilterTotal();
    expect(com.list[0].total).toEqual(1);
    expect(com.list[1].total).toEqual(2);
  });
  it('check "onFilterSalesPerson"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.list = [{ salesPerson: "3" }, { salesPerson: "2" }, { salesPerson: "1" }];
    com.onFilterSalesPerson();
    expect(com.list[0].salesPerson).toEqual("1");
    expect(com.list[1].salesPerson).toEqual("2");
  });
  it('check "onFilterCountTickets"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.list = [{ countTickets: 3 }, { countTickets: 2 }, { countTickets: 1 }];
    com.onFilterCountTickets();
    expect(com.list[0].countTickets).toEqual(1);
    expect(com.list[1].countTickets).toEqual(2);
  });
  it('check "onFilterName"', () => {
    const fixture = TestBed.createComponent(BillableComponent);
    const com = fixture.debugElement.componentInstance;
    com.list = [{ name: "3" }, { name: "2" }, { name: "1" }];
    com.onFilterName();
    expect(com.list[0].name).toEqual("1");
    expect(com.list[1].name).toEqual("2");
  });
});