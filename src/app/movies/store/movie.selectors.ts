import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MovieState } from './movie.reducer';
import { AppState } from '../../state/app.state';

export const MOVIES_FEATURE_KEY = 'movies';

export const selectMovies = createFeatureSelector<MovieState>(
  MOVIES_FEATURE_KEY
);

export const selectFeature = (state: AppState) => state.movies;

export const selectFeatureMovies = createSelector(
  selectFeature,
  (state: MovieState) => state.movies
);