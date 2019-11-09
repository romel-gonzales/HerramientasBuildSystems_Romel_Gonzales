import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'

//-------------------------- Importamos los servicios -------------
import {AuthService} from '../../servicios/auth.service'
import {CarritoService} from '../../servicios/carrito.service'

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css']
})
export class BarraComponent implements OnInit {
  private url : string

  constructor(private auth: AuthService,              
              private activatedRoute : ActivatedRoute,
              private carritoService : CarritoService
              ) { }

  ngOnInit() {
    this.url = this.activatedRoute.snapshot.url[0].path;
    return this.url
  }

  cerrarSesion()
  {
    this.auth.logout()
  }

}
