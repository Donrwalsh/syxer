import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matchup } from './matchup';

describe('Matchup', () => {
  let component: Matchup;
  let fixture: ComponentFixture<Matchup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Matchup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matchup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
