import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UsersFilterJobTitleComponent } from './users-filter-job-title.component';

describe('UsersFilterJobTitleComponent unit test', () => {
  let component: UsersFilterJobTitleComponent;
  let fixture: ComponentFixture<UsersFilterJobTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersFilterJobTitleComponent
      ]
    }).compileComponents();

  });

  it('check "setSelectedItemsWithoutChanges"', () => {
    const fixture = TestBed.createComponent(UsersFilterJobTitleComponent);
    const com = fixture.debugElement.componentInstance;
    com.jobTitleList = [
      { id: 1, name: 'Manager', selected: false }];
    com.setSelectedItemsWithoutChanges([{ id: 2, name: 'Manager', selected: true }]);
    expect(com.jobTitleList.length).toEqual(1);
  });
  it('check "clearWithOutChanges"', () => {
    const fixture = TestBed.createComponent(UsersFilterJobTitleComponent);
    const com = fixture.debugElement.componentInstance;
    com.jobTitleList = [
      { id: 1, name: 'Manager', selected: true }];
    com.clearWithOutChanges();
    expect(com.jobTitleList[0].selected).toEqual(false);
  });
});