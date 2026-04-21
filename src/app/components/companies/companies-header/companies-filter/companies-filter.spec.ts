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
import { CompaniesFilterComponent } from './companies-filter.component';


describe('CompaniesFilterComponent unit test', () => {
  let component: CompaniesFilterComponent;
  let fixture: ComponentFixture<CompaniesFilterComponent>;

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
        NoopAnimationsModule, CompaniesFilterComponent],
}).compileComponents();

  });
  it('check "onSelectTechLead"', () => {
    const fixture = TestBed.createComponent(CompaniesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectTechLead({ id: "test" });
    expect(com.companyFilter.techUser).toEqual("test");
  });
  it('check "onSelectType"', () => {
    const fixture = TestBed.createComponent(CompaniesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectType({ value: "test" });
    expect(com.companyFilter.clientType).toEqual("test");
  });
  it('check "onSelectClientIndustry"', () => {
    const fixture = TestBed.createComponent(CompaniesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectClientIndustry("test");
    expect(com.companyFilter.clientIndustry).toEqual("test");
  });
  it('check "onChangeTags"', () => {
    const fixture = TestBed.createComponent(CompaniesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeTags(["test", "test"]);
    expect(com.companyFilter.tags.length).toEqual(2);
  });
});