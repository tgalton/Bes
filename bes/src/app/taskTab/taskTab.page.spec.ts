import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { taskTab } from './taskTab.page';

describe('Tab1Page', () => {
  let component: taskTab;
  let fixture: ComponentFixture<taskTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [taskTab],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(taskTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
