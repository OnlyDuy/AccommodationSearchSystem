import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppScheduleWaitCancelComponent } from './app-schedule-wait-cancel.component';

describe('AppScheduleWaitCancelComponent', () => {
  let component: AppScheduleWaitCancelComponent;
  let fixture: ComponentFixture<AppScheduleWaitCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppScheduleWaitCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppScheduleWaitCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
