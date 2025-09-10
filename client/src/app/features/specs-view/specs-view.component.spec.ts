import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecsViewComponent } from './specs-view.component';

describe('SpecsViewComponent', () => {
  let component: SpecsViewComponent;
  let fixture: ComponentFixture<SpecsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
