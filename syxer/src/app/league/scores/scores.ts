import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-scores',
  imports: [CommonModule],
  templateUrl: './scores.html',
  styleUrl: './scores.css',
})
export class Scores {
  options = ['MPO1', 'MPO2', 'MPO3', 'FPO1', 'FPO2', 'FPO3'];
  selectedDivision = this.options[0]; // default

  selectDivision(option: string) {
    this.selectedDivision = option;
    // TODO: hook into your app logic here
  }
}
