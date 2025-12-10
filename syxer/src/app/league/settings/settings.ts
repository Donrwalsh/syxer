import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Team, Tournament } from '../../services/data.service';
import { selectTeams, selectTournaments } from '../../state/data.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  settingsForm!: FormGroup;
  players$!: Observable<Team[]>;
  tournaments$!: Observable<Tournament[]>;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      player: [''],
      tournament: [''],
    });

    this.players$ = this.store.select(selectTeams);
    this.tournaments$ = this.store.select(selectTournaments);
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      console.log('Settings saved:', this.settingsForm.value);
    } else {
      this.settingsForm.markAllAsTouched();
      console.log('Form invalid');
    }
  }
}
