import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHomeUserComponent } from './header-home-user.component';

describe('HeaderHomeUserComponent', () => {
  let component: HeaderHomeUserComponent;
  let fixture: ComponentFixture<HeaderHomeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderHomeUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderHomeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
