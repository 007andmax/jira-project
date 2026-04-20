import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NotificationsComponent } from './notifications.component';


describe('NotificationsComponent unit test', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        InfiniteScrollModule,
        FormsModule,
        DisabledBtnModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, NotificationsComponent],
}).compileComponents();

  });
  it('check "checkMarkAsReadAll"', () => {
    const fixture = TestBed.createComponent(NotificationsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.checkMarkAsReadAll()).toEqual(false);
  });
  it('check "setOnlyUnread"', () => {
    const fixture = TestBed.createComponent(NotificationsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setOnlyUnread(false);
    expect(com.onlyUnread).toEqual(false);
  });
  it('check "closed"', () => {
    const fixture = TestBed.createComponent(NotificationsComponent);
    const com = fixture.debugElement.componentInstance;
    com.opened = true;
    com.showPreloader = true
    com.closed();
    expect(com.opened).toEqual(false);
    expect(com.showPreloader).toEqual(false);
  });
});