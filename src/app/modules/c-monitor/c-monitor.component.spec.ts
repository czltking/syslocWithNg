import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CMonitorComponent } from './c-monitor.component';

describe('CMonitorComponent', () => {
  let component: CMonitorComponent;
  let fixture: ComponentFixture<CMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
