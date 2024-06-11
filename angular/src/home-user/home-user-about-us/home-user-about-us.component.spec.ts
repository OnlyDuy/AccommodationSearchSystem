import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserAboutUsComponent } from './home-user-about-us.component';

describe('HomeUserAboutUsComponent', () => {
  let component: HomeUserAboutUsComponent;
  let fixture: ComponentFixture<HomeUserAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeUserAboutUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
