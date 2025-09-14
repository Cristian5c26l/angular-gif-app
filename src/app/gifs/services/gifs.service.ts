import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { Gif } from '../interfaces/gif.interface';
import { map, Observable, tap } from 'rxjs';


const GIF_KEY = 'gifs';

const loadSearchHistoryFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {// la instancia o singlenton de GifService se va a proveer en la raiz de la aplicacion (app-root), permitiendo que cualquier componente hijo de dicha railz pueda utilizar esta instancia o singlenton.

  private http = inject(HttpClient);
  trendingGifs = signal<Gif[]>([]);// [gif,gif,gif,gif]
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);


  trendingGifGroups = computed<Gif[][]>(() => {// esto se ejecuta cuando cambia this.trendingGifs()... actualizando asi el valor de trendingGifGroups(), impactando o actualizando el html que contenga a trendingGifGroups()

    const groups = [];

    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    console.log({groups})

    return groups;

  });

  searchHistory = signal<Record<string, Gif[]>>(loadSearchHistoryFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));// cuando cambie el valor de la señal searchHistory, cambiara el valor de la señal searchHistoryKeys

  constructor() {
    console.log('GifService creado');
    this.loadTrendingGifs();// cambio de this.trendingGifs()
  }

  saveGifsToLocalStorage = effect(() => {// este efecto se ejecuta cada que la señal this.searchHistory() cambia su valor
    const historyGifsString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyGifsString);
  });

  loadTrendingGifs() {

    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20
      }
    })// aqui van observables

    .subscribe((resp) => {// necesita subscribe para que se lance la peticion .get
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update(currentTrendingGifs => [...currentTrendingGifs, ...gifs]);
      this.trendingPage.update(page => page + 1);
      this.trendingGifsLoading.set(false);
    });


  }

  searchGifs(query: string): Observable<Gif[]> {// searchGifs retorna un Observable, que emite un objeto de tipo Gif[]. Todo observable en angular puede ejecutar el metodo subscribe, que ocupa dicho objeto mencionado
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      }
    })// searchGifs retorna un observable que emite un objeto de tipo GiphyResponse (que es la respuesta de la peticion). Con pipe, encadeno operadores de RXJS como "map", que permite transformar dicho objeto a otro tipo de objeto. Este objeto transformado sera el que al final vaya directamente al subscribe, o se envie a otro operador de rxjs (como tap por ejemplo, que sirve para hacer algun tipo de efecto secundario... y ya de tap se enviaria al subscribe)
      .pipe(
        map(({ data }) => data),// data comienza y termina siendo de tipo GiphyItem[])
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),// items comienza siendo de tipo GiphyItem[], y al final es de tipo Gif[]
        tap((items) => {// items en este punto es de tipo Gif[], y termina asi
          this.searchHistory.update((currentSearchHistory) => ({
            ...currentSearchHistory,
            [query.toLowerCase()]: items,
          }));

        })
      );

    //.subscribe((resp) => {
    //  const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //  console.log({ search: gifs });
    //});
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

}
