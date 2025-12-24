import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { Company } from 'src/app/interfaces/company/company';
import { ManageCardsHeaderComponent } from './manage-cards-header.component';


describe('ManageCardsHeaderComponent unit test', () => {
  let component: ManageCardsHeaderComponent;
  let fixture: ComponentFixture<ManageCardsHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ManageCardsHeaderComponent
      ]
    }).compileComponents();

  });


  it('check "getTextCountFilters"', () => {
    const fixture = TestBed.createComponent(ManageCardsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTextCountFilters()).toEqual('Filters');
  });
  it('check "onChangeCountFilter"', () => {
    const fixture = TestBed.createComponent(ManageCardsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCountFilter(5);
    expect(com.countFilter).toEqual(5);
  });
  it('check "onToggleFilter"', () => {
    const fixture = TestBed.createComponent(ManageCardsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleFilter(true);
    expect(com.toggleFilter).toEqual(true);
  });
});