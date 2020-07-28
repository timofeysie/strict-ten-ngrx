import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from './movies-page/data/movie';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  movies: Array<Movie> = [
    { name: 'Movie 001' },
    { name: 'Movie 002' },
    { name: 'Movie 003' },
    { name: 'Movie 004' },
    { name: 'Movie 005' },
  ];
  constructor(private http: HttpClient) {}

  getAll() {
    // return this.http.get<Movie[]>('/movies');
    return of(this.movies);
  }
}
