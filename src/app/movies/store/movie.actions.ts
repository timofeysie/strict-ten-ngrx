import { createAction, props } from '@ngrx/store';
import { Movie } from '../movies-page/data/movie';

export const loadMovies = createAction(
  '[Movies Page] Load Movies',
  props<{ movies: Movie[] }>()
);

export const loadMoviesSuccess = createAction(
  '[Movies API] Movies Loaded Success'
);

export const loadMoviesError = createAction(
  '[Movies API] Movies Loaded Error'
);
