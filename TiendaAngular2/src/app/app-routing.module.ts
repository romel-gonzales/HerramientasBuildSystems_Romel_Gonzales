import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './componentes/login/login.component';
import {TiendaComponent} from './componentes/tienda/tienda.component';
import {CarroComponent} from './componentes/carro/carro.component';
import {DetalleComponent} from './componentes/tienda/detalle/detalle.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'tienda', component: TiendaComponent},
    {path: 'carrito', component: CarroComponent},
    {path: 'tienda/detalle/:id', component: DetalleComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})

export class RoutingLinks { } 