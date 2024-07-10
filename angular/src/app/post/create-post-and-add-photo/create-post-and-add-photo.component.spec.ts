import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostAndAddPhotoComponent } from './create-post-and-add-photo.component';

describe('CreatePostAndAddPhotoComponent', () => {
  let component: CreatePostAndAddPhotoComponent;
  let fixture: ComponentFixture<CreatePostAndAddPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePostAndAddPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostAndAddPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
