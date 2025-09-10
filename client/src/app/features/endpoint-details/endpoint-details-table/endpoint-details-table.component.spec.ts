import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointDetailsTableComponent } from './endpoint-details-table.component';

describe('EndpointDetailsTableComponent', () => {
  let component: EndpointDetailsTableComponent;
  let fixture: ComponentFixture<EndpointDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndpointDetailsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndpointDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
