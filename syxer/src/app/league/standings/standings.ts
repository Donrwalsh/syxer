import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectStandings, Standing } from '../../state/view-model.selectors';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings.html',
  styleUrl: './standings.css',
})
export class Standings {
  standings!: () => Standing[];

  constructor(private store: Store) {
    this.standings = this.store.selectSignal(selectStandings);
  }
}
