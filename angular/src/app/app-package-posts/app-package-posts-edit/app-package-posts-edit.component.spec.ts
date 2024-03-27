import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPackagePostsEditComponent } from './app-package-posts-edit.component';

describe('AppPackagePostsEditComponent', () => {
  let component: AppPackagePostsEditComponent;
  let fixture: ComponentFixture<AppPackagePostsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPackagePostsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPackagePostsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
