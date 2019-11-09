import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {AngularFireModule} from 'angularfire2';
//    Importar Servicios
import {AuthService} from "./servicios/auth.service"
import {TiendaService} from "./servicios/tienda.service"
import {CarritoService} from './servicios/carrito.service'

//    Importar Componentes   //
import { AppComponent } from './app.component';
import { RoutingLinks} from './app-routing.module'
import { environment } from '../environments/environment';
import {LoginComponent} from './componentes/login/login.component';
import {TiendaComponent} from './componentes/tienda/tienda.component';
import { SearchPipe } from './_pipe/search.pipe'
import { BarraComponent } from './componentes/barra/barra.component'
import {CarroComponent} from './componentes/carro/carro.component'
import {DetalleComponent} from './componentes/tienda/detalle/detalle.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TiendaComponent,
    SearchPipe,
    BarraComponent,
    CarroComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingLinks,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AuthService, TiendaService,CarritoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
