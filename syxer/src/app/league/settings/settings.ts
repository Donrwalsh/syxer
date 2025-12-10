import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Team } from '../../services/data.service';
import { selectTeams } from '../../state/data.selectors';
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

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      player: ['', Validators.required],
    });

    this.players$ = this.store.select(selectTeams);
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
