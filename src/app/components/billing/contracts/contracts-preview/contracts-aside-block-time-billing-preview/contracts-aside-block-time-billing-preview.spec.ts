import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { ContractsHeaderComponent } from './contracts-header.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ContractsHeaderComponent unit test', () => {
  let component: ContractsHeaderComponent;
  let fixture: ComponentFixture<ContractsHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ContractsHeaderComponent,
        ContractsFilterComponent
      ],
    }).compileComponents();

  });

  it('check "getSelectedInterval"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.getSelectedInterval();
    expect(com.selectedInterval).toEqual(`7 days`);
  });
  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDiscount({ discountAmount: 300 })).toEqual(`300 %`);
  });
  it('check "getIntervalText"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getIntervalText()).toEqual(`monthly`);
  });
  it('check "getIntervalText"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
  it('check "parseWithFixed"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseWithFixed(100)).toEqual("100.00");
  });
  it('check "getAssignedUserNameForAvatar"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getAssignedUserNameForAvatar(null)).toEqual("");
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "firstName", lastName: "lastName" })).toEqual("firstName lastName");
  });
});