import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MoviesPageComponent } from './movies-page/movies-page.component';
import { MovieEffects } from './store/movie.effects';
import { movieReducer } from './store/movie.reducer';

@NgModule({
  declarations: [MoviesPageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    EffectsModule.forFeature([MovieEffects]),
    StoreModule.forFeature('movies', movieReducer),
    // EffectsModule.forRoot([MovieEffects]),
  ],
  exports: [MoviesPageComponent],
})
export class MoviesModule {}
