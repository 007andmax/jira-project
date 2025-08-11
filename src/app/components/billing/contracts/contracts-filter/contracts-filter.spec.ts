import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ContractsFilterComponent } from './contracts-filter.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerIntervalsModule } from '../contracts-aside/date-picker-intervals/date-picker-intervals.module';



describe('ContractsFilterComponent unit test', () => {
  let component: ContractsFilterComponent;
  let fixture: ComponentFixture<ContractsFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        HttpClientModule,
        DatePickerIntervalsModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ContractsFilterComponent
      ],
    }).compileComponents();

  });

  it('check "onSelectOption"', () => {
    const fixture = TestBed.createComponent(ContractsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectOption({ type: 'manualCreateBillableItem' });
    expect(com.contractsFilter.manualCreateBillableItem).toEqual(true);
  });
  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(ContractsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompany(null);
    expect(com.contractsFilter.selectedCompany).toEqual(null);
  });
  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(ContractsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectStatus(null);
    expect(com.contractsFilter.selectedStatus).toEqual(null);
  });
  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(ContractsFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectType(null);
    expect(com.contractsFilter.selectedType).toEqual(null);
  });

});