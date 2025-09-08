import { Component, inject, OnInit, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})

export default class SearchPageComponent {

  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifService.searchGifs(query)
      .subscribe((resp) => {
        this.gifs.set(resp);
      })
  }

}// exportar por default para exportar por completo el SearcgPageComponent, que es requerido cuando se accede a él a traves de la ruta /dashboard de manera perezosa (lazy load)
