import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CompanyDashAssociateInfoComponent } from './company-dash-associate-info.component';


describe('CompanyDashAssociateInfoComponent unit test', () => {
  let component: CompanyDashAssociateInfoComponent;
  let fixture: ComponentFixture<CompanyDashAssociateInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanyDashAssociateInfoComponent
      ],
    }).compileComponents();

  });
  it('check "getCompanyName"', () => {
    const fixture = TestBed.createComponent(CompanyDashAssociateInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCompanyName(1)).toEqual('');
  });
  it('check "getPhoneNumber"', () => {
    const fixture = TestBed.createComponent(CompanyDashAssociateInfoComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getPhoneNumber(1)).toEqual('');
  });
});