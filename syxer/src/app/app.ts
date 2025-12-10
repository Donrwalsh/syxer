import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import { Store } from '@ngrx/store';
import { DataService } from './services/data.service';
import {
  loadTeamsSuccess,
  loadTeamsFailure,
  loadTeams,
  loadTournaments,
  loadTournamentsSuccess,
  loadTournamentsFailure,
} from './state/data.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('syxer');

  constructor(private store: Store, private dataService: DataService) {}

  ngOnInit() {
    // Simulate what your effect would do
    this.store.dispatch(loadTeams());
    this.dataService.getTeams().subscribe({
      next: (teams) => {
        this.store.dispatch(loadTeamsSuccess({ teams }));
      },
      error: (err) => {
        console.error('Error loading teams', err);
        this.store.dispatch(loadTeamsFailure({ error: err }));
      },
    });

    this.store.dispatch(loadTournaments());
    this.dataService.getTournaments().subscribe({
      next: (tournaments) => {
        this.store.dispatch(loadTournamentsSuccess({ tournaments }));
      },
      error: (err) => {
        console.error('Error loading tournaments', err);
        this.store.dispatch(loadTournamentsFailure({ error: err }));
      },
    });
  }
}
