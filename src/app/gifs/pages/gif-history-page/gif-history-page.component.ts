


import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history-page.component.html'
})

export default class GifHistoryPageComponent{

  gifService = inject(GifService);


  //query = inject(ActivatedRoute).params.subscribe(params => console.log(params["query"]))// "params" es un observable. En este caso, vamos a observar a los params. Si queremos hacer algo con estos params (que son los segmentos dinamicos (como query, especificado en app.routes.ts) que estan despues de la ruta activa que en este caso, es /dashboard/history, el cual muestra el componente GifHistoryPageComponent) cuando cambien, hay que suscribirnos a ellos, es decir, hacer params.subscribe().

  // Lo de abajo resume a lo de arriba, solo que, el objeto de tipo "Params", observado por el observable params, nos suscribimos a este observable para que, cuando cambie dicho objeto, se transforme a un string (que es params['query']), y se transforme a una señal de angular llamada query.
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map((params) => params['query']),
    )
  );

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));

}
