import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { CurrencyPipe } from '@angular/common'
import { OnChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


//    Importar Servicios
import {AuthService} from "../../servicios/auth.service";
import {CarritoService} from "../../servicios/carrito.service";
import {TiendaService} from "../../servicios/tienda.service";

//   Importar Modelos
import {ProductoCarrito} from '../../modelos/producto-carrito';
import {Producto} from '../../modelos/Producto'
import { FirebaseListObservable, AngularFire } from 'angularfire2';

@Component({
  selector: 'tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  private formulario : FormGroup;
  public listaProductos : Producto[]
  public productoCarrito : ProductoCarrito
  public session : string
 
  

  constructor(
              private router: Router,
              private tiendaService: TiendaService,
              private auth: AuthService,     
              private carritoService : CarritoService
              )           
    {     }

  ngOnInit() {

    if(!this.auth.validarSesion()){
      this.router.navigate(['/login'])
    }
    else
    {
      this.session = sessionStorage.getItem("Carrito")
      this.formulario = new FormGroup({
        'descripcion' : new FormControl(),
        'imagen' : new FormControl(),
        'precio' : new FormControl(),
        'cantidad' : new FormControl()
      })
      this.mostrarProductos();
    }
  }

  mostrarProductos(){
    if(!this.tiendaService.productosCatalogo){
      this.tiendaService.getProductos().subscribe(() => {
        this.listaProductos = this.tiendaService.catalogo 
        this.checkCarrito()
      })
    }
    else{
      this.listaProductos = this.tiendaService.productosCatalogo
    }
  }


  agregarProducto(id:number, value:number){
    //console.log('valores de Id y cantidad son: '+id+' --- '+value)  
    for(let item of this.tiendaService.productosCatalogo){
      if(item.id == id){
        if(item.disponible < value){
          window.alert('Producto disponible es: '+item.disponible)
        }
        else{
          let cantidadActual = item.disponible
          this.productoCarrito = {
            "id" : item.id,
            "descripcion": item.descripcion,
            "imagen" : item.imagen,
            "precio" : item.precio,
            "cantidad" : value
          }
          this.carritoService.verificarCarrito(this.productoCarrito)
          item.disponible = cantidadActual - value   
        }
      }
    }
  }

  checkCarrito(){
    for(let itemCarrito of this.carritoService.listaCarrito){
      this.tiendaService.actualizarDisponible(itemCarrito.id, itemCarrito.cantidad)
    }
  }

  obtenerCantidad(id : number){
    for(let item of this.carritoService.listaCarrito){
      if(item.id == id){
        return item.cantidad
      }
    }
    return null
  }  

}  

