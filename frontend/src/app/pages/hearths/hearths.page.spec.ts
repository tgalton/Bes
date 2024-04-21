import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearthsPage } from './hearths.page';

describe('HearthsPage', () => {
  let component: HearthsPage;
  let fixture: ComponentFixture<HearthsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HearthsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
