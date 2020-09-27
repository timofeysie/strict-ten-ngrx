import { createReducer, on, State } from '@ngrx/store';
import { loadMovies, loadMoviesSuccess } from './movie.actions';
import { Movie } from '../movies-page/data/movie';

// export const initialState: any = {
//   movies: [],
// };

export const initialState: Movie[] = [];

// export interface MovieState {
//   movies: Movie[];
// }

// tslint:disable-next-line: variable-name
// const _movieReducer = createReducer<MovieState>(
const _movieReducer = createReducer<Movie[]>(
  initialState,
  on(loadMovies, (state): Movie[] => [...state]),

  on(loadMoviesSuccess, (state, action) => [...state, ...action.payload])

  // on(
  //   loadMovies,
  //   (state) => ({
  //     ...state,
  //   })
  // ),
  // on(loadMoviesSuccess, (state, action) => ({
  //   ...state,
  //   movies: action.payload,
  // }))
);
// tslint:disable-next-line: typedef no-any
export function movieReducer(state: any, action: any) {
  return _movieReducer(state, action);
}
