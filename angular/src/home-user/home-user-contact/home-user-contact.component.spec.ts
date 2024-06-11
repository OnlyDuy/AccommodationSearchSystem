import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserContactComponent } from './home-user-contact.component';

describe('HomeUserContactComponent', () => {
  let component: HomeUserContactComponent;
  let fixture: ComponentFixture<HomeUserContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeUserContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
