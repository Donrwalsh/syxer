import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPlayer, selectTournament } from '../../state/config.selectors';
import { selectMatchups } from '../../state/matchup.selectors';
import { selectFullTournamentStandings } from '../../state/standings.selectors';

@Component({
  selector: 'app-matchup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matchup.html',
  styleUrl: './matchup.css',
})
export class Matchup {
  matchups!: () => any[];
  configTourn!: () => number;
  configPlayer!: () => number;
  standings!: () => any[];

  record = '';
  rank = -1;
  waiver = -1;

  constructor(private store: Store) {
    this.configTourn = this.store.selectSignal(selectTournament);
    this.configPlayer = this.store.selectSignal(selectPlayer);
    this.matchups = this.store.selectSignal(selectMatchups);
    this.standings = this.store.selectSignal(selectFullTournamentStandings(this.configTourn()));

    this.record = `${
      this.standings().find((standing) => standing.teamId == this.configPlayer()).wins
    }-${this.standings().find((standing) => standing.teamId == this.configPlayer()).losses}`;

    this.rank = this.standings().findIndex((s) => s.teamId == this.configPlayer()) + 1;

    this.waiver = 11 - this.rank;
  }

  get nextUpcoming() {
    return this.matchups().find((e) => !e.completed) || null;
  }

  get completedEvents() {
    const sorted = this.matchups()
      .filter((e) => e.completed)
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

    return sorted;
  }
}
