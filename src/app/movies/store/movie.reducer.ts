import { createReducer, on, State } from '@ngrx/store';
import { loadMovies, loadMoviesSuccess } from './movie.actions';
import { Movie } from '../movies-page/data/movie';

export const initialState: MovieState = {
  movies: [],
};

export interface MovieState {
  movies: Movie[];
}

// tslint:disable-next-line: variable-name
const _movieReducer = createReducer<MovieState>(
  initialState,
  on(
    loadMovies,
    (state): MovieState => ({
      ...state
    })
  ),
  on(loadMoviesSuccess, (state, action) => ({
    ...state,
    data: action.payload,
  }))
);
// tslint:disable-next-line: typedef no-any
export function movieReducer(state: any, action: any) {
  return _movieReducer(state, action);
}
