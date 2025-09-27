import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitressDashboardComponent } from './waitress-dashboard.component';

describe('WaitressDashboardComponent', () => {
  let component: WaitressDashboardComponent;
  let fixture: ComponentFixture<WaitressDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitressDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitressDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
