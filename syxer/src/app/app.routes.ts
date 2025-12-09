import { Routes } from '@angular/router';
import { Scores } from './league/scores/scores';
import { Roster } from './league/roster/roster';
import { Matchup } from './league/matchup/matchup';
import { Stats } from './league/stats/stats';
import { Standings } from './league/standings/standings';
import { Settings } from './league/settings/settings';
import { Waiver } from './league/waiver/waiver';

export const routes: Routes = [
  { path: 'scores', component: Scores },
  { path: 'roster', component: Roster },
  { path: 'matchup', component: Matchup },
  { path: 'stats', component: Stats },
  { path: 'standings', component: Standings },
  { path: 'waiver', component: Waiver },
  { path: 'settings', component: Settings },
  //   { path: '', redirectTo: '/scores', pathMatch: 'full' },
];
