import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { provideHttpClient } from '@angular/common/http';
import { ScoresComponent } from './scores/scores.component';
import { PlayerDataGuard } from './services/player-data-guard.service';
import { MyScoresComponent } from '../my-scores/my-scores.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'scores', component: ScoresComponent },
      { path: 'my-scores', component: MyScoresComponent },
      { path: 'intro-page', component: IntroPageComponent },
      { path: 'snake-game', component: GamePageComponent, canActivate: [PlayerDataGuard] },
      { path: 'snake-game/:colors', component: GamePageComponent, canActivate: [PlayerDataGuard] },
      { path: '', redirectTo: '/intro-page', pathMatch: 'full' },
      { path: '**', redirectTo: '/intro-page' },
    ]),
    provideHttpClient(),
  ],
};
