import { Injectable } from '@angular/core';
import {ProductoCarrito} from '../modelos/producto-carrito'

@Injectable()
export class CarritoService {

  public listaCarrito : ProductoCarrito[] = []
  private totales :  number[]
  
  constructor() {
                  this.totales = []
                  this.contadorCarrito()
   }

   contadorCarrito(){
    return this.itemsCarrito().length
   }

   itemsCarrito(){
    if(sessionStorage.getItem("Carrito")){
      this.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito"))
      return JSON.parse(sessionStorage.getItem("Carrito"))
    }
    return 0
   }

   verificarCarrito(item){
     if(this.guardarCarrito(item) == false){
       this.listaCarrito.push(item)
     }
     sessionStorage.setItem("Carrito", JSON.stringify(this.listaCarrito))
   }

   guardarCarrito(item){
    if(this.listaCarrito.length > 0){
      for(let itemGuardado of this.listaCarrito){
        if(itemGuardado.id == item.id){
          itemGuardado.cantidad = Number(itemGuardado.cantidad) + Number(item.cantidad)
          return true
        }
      }
      return false
    }
    return false
   }

   eliminarCarrito(listaCarrito){
    sessionStorage.setItem("Carrito", JSON.stringify(listaCarrito))
   }

   subtotal(precio, cantidad){
     let subtotal = Number(cantidad) * Number(precio)
     this.totales.push(subtotal)
     return subtotal
   }


}
