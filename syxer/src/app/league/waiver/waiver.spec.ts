import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Waiver } from './waiver';

describe('Waiver', () => {
  let component: Waiver;
  let fixture: ComponentFixture<Waiver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waiver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Waiver);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
