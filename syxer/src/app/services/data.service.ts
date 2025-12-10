import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Tournament {
  id: number;
  name: string;
  start: string;
  end: string;
  matches: Match[];
}

export interface Match {
  matchup: number;
  teamId: number;
  score: number;
}

export interface Team {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'assets';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http
      .get<any>(`${this.baseUrl}/players.json`)
      .pipe(map((response) => response.teams));
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<any>(`${this.baseUrl}/tournaments.json`).pipe(map((response) => response));
  }
}
