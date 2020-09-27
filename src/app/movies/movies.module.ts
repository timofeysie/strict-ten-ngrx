import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { MoviesPageComponent } from './movies-page/movies-page.component';
import { MovieEffects } from './store/movie.effects';


@NgModule({
  declarations: [MoviesPageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    EffectsModule.forRoot([MovieEffects]),
  ],
  exports: [MoviesPageComponent],
})
export class MoviesModule {}
