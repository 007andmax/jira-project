import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CompanyDashDetailComponent } from './company-dash-detail.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

describe('CompanyDashDetailComponent unit test', () => {
  let component: CompanyDashDetailComponent;
  let fixture: ComponentFixture<CompanyDashDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule],
    providers: [{ provide: Router, useValue: mockRouter }],
    declarations: [CompanyDashDetailComponent],
}).compileComponents();

  });
  it('check "isArchive"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isArchive()).toEqual(false);
  });
  it('check "onChangeStartTimePicker"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeStartTimePicker(100000);
    expect(com.currentService.durationStart).toEqual(100000);
  });
  it('check "onChangeEndTimePicker"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeEndTimePicker(100000);
    expect(com.currentService.durationEnd).toEqual(100000);
  });
  it('check "setTab"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    com.setTab('users');
    expect(com.tab).toEqual('users');
  });
  it('check "getJobTitle"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getJobTitle({ jobTitleId: 1 })).toEqual("");
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "test", lastName: "test" })).toEqual("test test");
  });
  it('check "getCharacter"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCharacter("Ben")).toEqual("Be");
  });
  it('check "timeFormatter"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.timeFormatter(null)).toEqual("00:00");
  });
  it('check "timeFormat"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.timeFormat(null)).toEqual(0);
  });
  it('check "getTimeFormat"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTimeFormat(null)).toEqual("AM");
  });
  it('check "fromTime_convert"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.fromTime_convert(3600)).toEqual("01:00");
  });
  it('check "toTime_convert"', () => {
    const fixture = TestBed.createComponent(CompanyDashDetailComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.toTime_convert(3600)).toEqual("01:00");
  });
});