import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './dashboard-page.component.html',
})

export default class DashboardPageComponent {}// exportar por default para exportar por completo el DashboardPageComponent, que es requerido cuando se accede a él a traves de la ruta /dashboard de manera perezosa (lazy load)
