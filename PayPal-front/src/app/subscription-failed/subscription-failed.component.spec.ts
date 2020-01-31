import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionFailedComponent } from './subscription-failed.component';

describe('SubscriptionFailedComponent', () => {
  let component: SubscriptionFailedComponent;
  let fixture: ComponentFixture<SubscriptionFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
