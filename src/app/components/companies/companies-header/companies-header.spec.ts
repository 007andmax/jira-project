import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompaniesHeaderComponent } from './companies-header.component';


describe('CompaniesHeaderComponent unit test', () => {
  let component: CompaniesHeaderComponent;
  let fixture: ComponentFixture<CompaniesHeaderComponent>;

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
      declarations: [CompaniesHeaderComponent
      ],
    }).compileComponents();

  });
  it('check "clearSearch"', () => {
    const fixture = TestBed.createComponent(CompaniesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.searchText = "test";
    com.clearSearch();
    expect(com.searchText).toEqual("");
  });
  it('check "getTextCountFilters"', () => {
    const fixture = TestBed.createComponent(CompaniesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.countFilter = 7;
    expect(com.getTextCountFilters()).toEqual(`Filters (7)`);
  });
});