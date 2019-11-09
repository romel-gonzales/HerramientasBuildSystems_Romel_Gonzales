import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'

//---------- Importar Servicios --------------
import {AuthService} from "../../../servicios/auth.service"
import {TiendaService} from "../../../servicios/tienda.service"
import {CarritoService} from "../../../servicios/carrito.service"
import {BarraComponent} from '../../barra/barra.component'
//----------- Importar Modelos -----------
import {Producto} from '../../../modelos/producto'
import {ProductoCarrito} from '../../../modelos/producto-carrito'

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  private informacionProducto : Producto
  private productoCarrito : ProductoCarrito

  constructor(
              private tiendaService : TiendaService,
              private router : Router,
              private auth : AuthService,
              private carritoService : CarritoService,
              private activatedRoute : ActivatedRoute
              ) { }

  ngOnInit() {
    if(!this.auth.validarSesion()){
      this.router.navigate(['/login'])
    }
    else
    {
      this.detalleProducto()
    }
  }

  detalleProducto(){
    this.activatedRoute.params.subscribe(params =>{

      if(this.tiendaService.cargarCatalogo()){
        this.informacionProducto = this.tiendaService.getDetalleProductos(params['id'])        
        console.log('if(this.tiendaService.cargarCatalogo(): '+JSON.stringify(this.informacionProducto))
      }
      else
      {
        this.tiendaService.getProductos().subscribe(()=>{
          this.checkCarrito()
          this.informacionProducto = this.tiendaService.getDetalleProductos(params['id'])
          console.log('else (this.tiendaService.cargarCatalogo(): '+JSON.stringify(this.informacionProducto))
        })
      }
    })
  }

  agregarProducto(id : number, value : number){
    for(let item of this.tiendaService.productosCatalogo){
      if(item.id == id){
        if(item.disponible < value){
          window.alert('Maxima existencia es: '+item.disponible)
        }
        else{
          let cantidadActual = item.disponible
          this.productoCarrito = {
            "id": item.id,
            "descripcion": item.descripcion,
            "imagen": item.imagen,
            "precio": item.precio,
            "cantidad": value
          }
          this.carritoService.verificarCarrito(this.productoCarrito)
          item.disponible = cantidadActual - value
          }
        }
      }
    }

    obtenerCantidad(id: number){
      for(let item of this.carritoService.listaCarrito){
        if(item.id == id){
          return item.cantidad
        }
      }
      return null
    }

    checkCarrito()
    {
      for(let itemCarrito of this.carritoService.listaCarrito){
        this.tiendaService.actualizarDisponible(itemCarrito.id, itemCarrito.cantidad)
      }
    }

    navegacionAtras(id: number){
      let value = Number(id-1)
      if(value >= 0){
        return value
      }
      return id
    }

    navegacionSiguiente(id : number){
      if(id < this.tiendaService.cargarCatalogo().length){
        let value = Number(id+1)
        return value
      }
      return id
    }


}  



