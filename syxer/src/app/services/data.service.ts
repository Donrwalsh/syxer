import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface PDGA {
  tournaments: PDGATourn[];
}

export interface PDGATourn {
  // field data etc.
  tournId: number;
  stats: StatsBlock[];
}

export interface StatsBlock {
  athleteName: string;
  athleteId: string; // number?
  division: string;
  round: number;
  strokes: Strokes;
  stats: Stats;
  makes: Makes;
  ranking: Ranking;
}

export interface Ranking {
  place: number;
  fieldSize: number;
}

export interface Makes {
  c1x: number;
  c1xBonus: number;
  c2: number;
  c3Bonus: number;
  throwIns: number;
}

export interface Stats {
  c1r: number;
  c2r: number;
  parked: number;
  ob: number;
  ace: number;
  noStats: number; //boolean maybe?
}

export interface Strokes {
  doubleBogey: number;
  bogey: number;
  par: number;
  birdie: number;
  eagle: number;
  albatross: number;
}

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
  athleteSelections: AthleteSelect[];
}

export interface AthleteSelect {
  tournId: number;
  mpo1: string;
  mpo2: string;
  mpo3: string;
  fpo1: string;
  fpo2: string;
  fpo3: string;
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

  getPdgaSupremeFlightData(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/Supreme_Flight_Open/MPO-1.json`)
      .pipe(map((response) => response));
  }
}
