import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditContactComponent } from './new-edit-contact.component';

describe('NewEditContactComponent', () => {
  let component: NewEditContactComponent;
  let fixture: ComponentFixture<NewEditContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
