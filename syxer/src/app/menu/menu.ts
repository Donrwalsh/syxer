import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuReadout, selectMenuReadout } from '../state/view-model.selectors';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  menuReadout!: () => MenuReadout;

  playerName = computed(() => this.menuReadout().playerName);
  nextTournamentName = computed(() => this.menuReadout().nextTournamentName);
  week = computed(() => this.menuReadout().week);
  
  constructor(private store: Store) {
    this.menuReadout = this.store.selectSignal(selectMenuReadout);
  }
}
