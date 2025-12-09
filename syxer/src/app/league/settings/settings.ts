import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Team } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  settingsForm!: FormGroup;
  players: Team[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      player: ['', Validators.required],
    });

    this.dataService.getTeams().subscribe({
      next: (teams) => {
        this.players = teams;
      },
      error: (err) => {
        console.error('Error fetching teams:', err);
      },
    });
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
