import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';
import { ContractsHeaderComponent } from './contracts-header.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


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
        })],
      declarations: [ContractsHeaderComponent,
        ContractsFilterComponent
      ],
    }).compileComponents();

  });

  it('check "getTextCountFilters"', () => {
    const fixture = TestBed.createComponent(ContractsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.countFilter = 7;
    expect(com.getTextCountFilters()).toEqual(`Filters (7)`);
  });
});