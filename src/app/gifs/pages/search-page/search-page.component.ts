import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-page',
  imports: [],
  templateUrl: './search-page.component.html',
})

export default class SearchPageComponent {}// exportar por default para exportar por completo el SearcgPageComponent, que es requerido cuando se accede a él a traves de la ruta /dashboard de manera perezosa (lazy load)
