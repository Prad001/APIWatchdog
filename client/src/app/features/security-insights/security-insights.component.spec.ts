import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityInsightsComponent } from './security-insights.component';

describe('SecurityInsightsComponent', () => {
  let component: SecurityInsightsComponent;
  let fixture: ComponentFixture<SecurityInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
