import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})

export default class TrendingPageComponent implements AfterViewInit{

  // imageUrls = imageUrls;

  gifService = inject(GifService);// injectar a este componente el singlenton de GifService, proveido en el root de la aplicacion. Este gifService puede usarse directamente en el html de este componente
  // gifs = computed(() => this.gifService.trendingGifs())
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {// esta funcion se ejecuta cuando este componente TrendingPageComponent ya haya sido renderizado
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();

  }

  onScroll(event: Event) {

    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    const clientHeight = scrollDiv.clientHeight;// altura en pixeles en pantalla que ve el usuario
    const scrollHeight = scrollDiv.scrollHeight;// altura en pixeles del div al que se hace referencia al cual se hace scroll hacia a abajo
    const scrollTop = scrollDiv.scrollTop;// numero de pixeles o cantidad que se ha hecho scroll hacia abajo al div al que se hace referencia

    const isAtBottom = clientHeight + scrollTop + 300 >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }

  }
}// exportar por default para exportar por completo el TrendingPageComponent, que es requerido cuando se accede a él a traves de la ruta /dashboard de manera perezosa (lazy load)
