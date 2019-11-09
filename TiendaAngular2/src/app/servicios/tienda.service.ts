import { Injectable } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2'
import {Http, Response} from '@angular/http'
import {Router} from '@angular/router'
import 'rxjs/Rx'

//--------- Importamos Modelo ----------------
import {Producto} from '../modelos/producto'


@Injectable()
export class TiendaService {
  public productosCatalogo : Producto[]
  public catalogo : Producto []

  constructor(private db: AngularFire,
              private http: Http,
              private router: Router
             ) 
  { }

  public getProductos(){
    return this.http.get('https://angulartienda-78c78.firebaseio.com/productos/.json').map(
      (response : Response) => {
        this.catalogo = response.json()
        this.productosCatalogo = this.catalogo   
      }
    )
  }

  actualizarDisponible(id : number, value : number, devolver : boolean = false){
    let catalogo = this.catalogo
    for(let itemCatalogo of catalogo){
      if(itemCatalogo.id == id){
        if(devolver == false){
          itemCatalogo.disponible = (Number(itemCatalogo.disponible) + value)
        }
        else{
          itemCatalogo.disponible = (Number(itemCatalogo.disponible) + value)
        }
          this.productosCatalogo = this.catalogo

      }
    }
  }

  cargarCatalogo(){
    return this.productosCatalogo
  }

  public getDetalleProductos(idProduct : number) : Producto {
    for(let item of this.productosCatalogo){
      if(item.id == idProduct){
        return item
      }
    }
    return null
  }

}
