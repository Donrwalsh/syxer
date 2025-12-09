import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// Example interface for your data
export interface Team {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root', // makes the service available app-wide
})
export class DataService {
  private baseUrl = 'assets';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http
      .get<any>(`${this.baseUrl}/players.json`)
      .pipe(map((response) => response.teams));
  }
}
