import { Component, OnInit } from '@angular/core';
import {ChangeDetectorRef} from '@angular/core'
import {Http, Response} from '@angular/http'
import {Router} from '@angular/router'
import 'rxjs/Rx'

//--------- Importacion Servicio -------------
import {AuthService} from "../../servicios/auth.service"
import {CarritoService} from '../../servicios/carrito.service'
import {TiendaService} from '../../servicios/tienda.service'

//----------- Importar Modelo ----------------
import {Producto} from '../../modelos/producto'
import {ProductoCarrito} from '../../modelos/producto-carrito'

@Component({
  selector: 'app-carro',
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css']
})
export class CarroComponent implements OnInit {
  public listaCarrito : ProductoCarrito[] = [];
  public catalogo : Producto[] = []
  public titulo : string


  constructor(
              private carritoService : CarritoService,
              private detectChanges : ChangeDetectorRef,
              private tiendaService : TiendaService,
              private auth : AuthService,
              private http : Http,
              private router : Router
  ) { 
      this.titulo = 'Carrito de compras'
    }

  ngOnInit() {
    if(!this.auth.validarSesion()){
      console.log(sessionStorage.getItem("Session"))
      this.router.navigate(['/login'])
    }
    else{
      this.listaCarrito = this.carritoService.itemsCarrito()
    }
  }

  total(){
    let total : number = 0
    let items = this.carritoService.listaCarrito
    for(let subtotal of items){      
      total += subtotal.cantidad * subtotal.precio
    }
    return total
  }

  pagarCarrito(){
    this.http.get('https://angulartienda-78c78.firebaseio.com/productos/.json').map((response : Response) =>{
      this.catalogo = response.json()
      console.log('pagarCarrito() consulta_ :'+response)
    }).subscribe(()=>{ 
      for(let itemCatalogo of this.catalogo){
        for(let item of this.listaCarrito){
          if(itemCatalogo.id == item.id){
            let cantidad = Number(item.cantidad)
            itemCatalogo.disponible = itemCatalogo.disponible - cantidad
            this.actualizarDisponible(item.id, itemCatalogo).subscribe(
              (response) => {
                console.log('listo para vaciar carrito al pagar_ :'+response)
                this.vaciarCarrito()
              }
            )
          }          
        }
      }
      this.router.navigate(['/tienda'])
    })
  }

  actualizarDisponible(id : number, itemCatalogo : Producto){
    return this.http.put(`https://angulartienda-78c78.firebaseio.com/productos/${id-1}.json`, itemCatalogo).map((response : Response) =>{
      return this.catalogo = response.json()
    })
  }

  vaciarCarrito(){
    sessionStorage.setItem('Carrito', '[]')
    this.listaCarrito = []
    this.carritoService.eliminarCarrito(this.listaCarrito)
    this.carritoService.listaCarrito = []
    this.tiendaService.getProductos().subscribe()
  }

  eliminarProducto(id : number, value : number){
    for(let item of this.listaCarrito){
      if(item.id = id){
        let index = this.listaCarrito.indexOf(item)
        if(value == null){
          this.listaCarrito.splice(index, 1)
          this.carritoService.eliminarCarrito(this.listaCarrito)
          this.total()
          this.tiendaService.actualizarDisponible(id, Number(item.cantidad), true)
        }
        else{
          if(value > 0){
            let validar = (Number(item.cantidad) - value)
            if(validar < 0){
              window.alert('La cantidad indicada excede a la cantidad en el carrito.')
            }
            else{
              item.cantidad = validar
              if(item.cantidad == 0){
                this.listaCarrito.splice(index, 1)
              }
              this.carritoService.eliminarCarrito(this.listaCarrito)
              this.tiendaService.actualizarDisponible(id, Number(value), true)
            }
          }
          else{
            window.alert('Debe especificar una cantidad válida')
          }
        }
      }
    }
    this.detectChanges.detectChanges()
  }


}
