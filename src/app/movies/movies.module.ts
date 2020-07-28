import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MoviesPageComponent } from './movies-page/movies-page.component';



@NgModule({
  declarations: [MoviesPageComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [MoviesPageComponent],
})
export class MoviesModule {}
