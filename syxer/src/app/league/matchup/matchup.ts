import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-matchup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matchup.html',
  styleUrl: './matchup.css',
})
export class Matchup {
  // Dummy values — replace with NgRx selectors later
  record = '1-1';
  rank = 3;
  waiver = 5;

  events = [
    {
      id: 1,
      name: 'Supreme Flight Open',
      opponent: 'Jame Team',
      myPoints: 715,
      opponentPoints: 607,
      result: 'W',
      completed: true,
      start: '2025-02-28',
    },
    {
      id: 2,
      name: 'Waco Annual Charity Open',
      opponent: 'Laura',
      myPoints: 607,
      opponentPoints: 751,
      result: 'L',
      completed: true,
      start: '2025-03-14',
    },
    {
      id: 3,
      name: 'The Open at Austin',
      opponent: 'Ginter',
      myPoints: 0,
      opponentPoints: 0,
      result: '',
      completed: false,
      start: '2025-03-20',
    },
    {
      id: 4,
      name: 'Music City Open',
      opponent: 'Bajari',
      myPoints: 0,
      opponentPoints: 0,
      result: '',
      completed: false,
      start: '2025-03-28',
    },
  ];

  // Compute the next upcoming event
  get nextUpcoming() {
    return this.events.find((e) => !e.completed) || null;
  }

  // Completed events
  get completedEvents() {
    // Filter completed events and sort descending by start date
    const sorted = this.events
      .filter((e) => e.completed)
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

    return sorted;
  }
}
