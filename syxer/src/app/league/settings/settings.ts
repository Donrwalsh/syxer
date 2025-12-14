import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Team, Tournament } from '../../services/data.service';
import { setPlayer, setTourn } from '../../state/config.actions';
import { selectPlayer, selectTournament } from '../../state/config.selectors';
import { selectTeams, selectTournaments } from '../../state/data.selectors';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  settingsForm!: FormGroup;
  configPlayer$!: Observable<number>;
  configTourn$!: Observable<number>;
  players$!: Observable<Team[]>;
  tournaments$!: Observable<Tournament[]>;

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.configPlayer$ = this.store.select(selectPlayer);
    this.configTourn$ = this.store.select(selectTournament);

    this.settingsForm = this.fb.group({
      player: [''],
      tournament: [''],
    });

    this.configPlayer$.subscribe(player => {
      this.settingsForm.patchValue({ player });
    });

    this.configTourn$.subscribe(tournament => {
      this.settingsForm.patchValue({ tournament });
    });


    this.players$ = this.store.select(selectTeams);
    this.tournaments$ = this.store.select(selectTournaments);
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      this.store.dispatch(setPlayer({ player: Number(this.settingsForm.value.player) }))
      this.store.dispatch(setTourn({ tournament: Number(this.settingsForm.value.tournament) }))
    } else {
      this.settingsForm.markAllAsTouched();
      console.log('Form invalid');
    }
  }
}
