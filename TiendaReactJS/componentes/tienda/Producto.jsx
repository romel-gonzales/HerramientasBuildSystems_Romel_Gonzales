import React from 'react'
import * as firebase from 'firebase'
import {BrowserRouter as Router, Route, Link,IndexRoute} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'

import Tienda from './Tienda.jsx'
import BarraNavegacion from './BarraNavegacion.jsx'
import Carrito from './Carrito.jsx'
import LoginForm from '../Login.jsx'

class Producto extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            producto : [],
            listaProductos : [],
            idProducto : [],
            atras : 0,
            siguiente : 0,
            refresh : false
        }
    }

    componentWillMount(){
        const {idProducto} = this.props.match.params
        const listaProductos = []
        const producto = []
            if(this.state.producto == ""){
                firebase.database().ref("productos").once("value").then((snapshot) =>{
                    snapshot.forEach(function(childSnapshot){
                        var key = childSnapshot.key
                        var childData = childSnapshot.val()
                        if(childData.id == idProducto){
                            producto.push(childData)
                        }
                        listaProductos.push(childData)
                    })
                    this.setState({listaProductos : listaProductos, producto : producto})
                })
                this.navegacion(idProducto)                        
            }
    }

    render(){
        return(
            <div className="tienda row">
                <div className="container">
                    <BarraNavegacion contador={this.contadorCarrito()} />
                    <div className="col s12 box carrito blue darken-1">
                        <h5 className="left">
                            <Link to="/tienda" className="white-text">Tienda</Link><span className="white-text"> > {this.state.producto.map((producto) => producto.descripcion)}</span>                            
                        </h5>
                    </div>
                    <div className="col s12 box carrito white">
                    {   this.mostrarProducto()    }
                    </div>

                </div>
            </div>
        )
    }

    mostrarProducto(){
        return this.state.producto.map(
            (producto) => {return (<DetalleProducto siguiente={this.state.siguiente} atras={this.state.atras} navegacion={this.navegacion.bind(this)} listaProductos={this.state.listaProductos} actualizarDisponible={this.actualizarDisponible.bind(this)} key={producto.id} producto={producto} />)}
        )
    }

    itemsCarrito(){
        if(sessionStorage.getItem("Carrito")){
            this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito"))
            return JSON.parse(sessionStorage.getItem("Carrito"))
        }
        return 0
    }

    contadorCarrito(){
        return this.itemsCarrito().length
    }

    actualizarDisponible(item, cantidad){
        for(let productoLista of this.state.producto){
            if(productoLista.id == item.id){
                this.verificarCarrito(item, cantidad)
                productoLista.disponible = (Number(productoLista.disponible) - Number(cantidad))
                this.setState({producto : this.state.producto})
                this.setState({listaCarrito : this.state.listaCarrito})
            }
        }
    }

    verificarCarrito(item, cantidad){
        if(this.guardarCarrito(item, cantidad) == false){
            this.state.listaCarrito.push(item)
        }
        this.setState({listaCarrito : this.state.listaCarrito})
        sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito))
    }

    guardarCarrito(item, cantidad){
        if(this.state.listaCarrito.length > 0){
            for(let itemGuardado of this.state.listaCarrito){
                if(itemGuardado.id == item.id){
                    itemGuardado.cantidad = (Number(itemGuardado.cantidad) + Number(cantidad))
                    return true
                }
            }
            return false                
        }
        return false
    }

    navegacion(id: number){
        let back = Number(id - 1)
        if(back >= 0){
            this.setState({atras : back})
        }

        let next = Number(id + 1)
        if(id < this.state.listaProductos.lenght){
            this.setState({siguiente : next})
        }
    }

}

export default Producto


class DetalleProducto extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            inputValue : 1,
            disponible : this.props.producto.disponible,
            contadorCarrito : 0,
            listaProductos : this.props.listaProductos,
            listaCarrito : JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : [],
            producto: this.props.producto,
            productoCarrito : {
                id : '',
                descripcion : '',
                imagen : '',
                cantidad : '',
            },
            atras : this.props.atras,
            siguiente : this.props.siguiente,
        }
    }

    componentWillMount(){
        this.checkCarrito(this.props.producto)
        this.props.navegacion(this.props.producto.id)
    }

    render(){
        if(!sessionStorage.getItem('Session')){
            return <Redirect to="/" />
        }
        const producto = this.props.producto
        return(
            <div className="left">
            <h2 className="card-title">{producto.descripcion}</h2>        
            <div className="col s12 m4 l6 right">
                <div className="card">
                    <div className={this.state.disponible ? 'card-image' : 'card-image grayscale'}>
                        <img src={'/'+producto.imagen} />
                    </div>
                <div className="card-content">
                   <div className="informacion blue-grey-text text-darken-2">
                        <span hidden={this.state.contador ? false : true} className="badge carrito"><Link to="/carrito"><small className="white-text text-shadow"><i className="material-icons left">shopping_cart</i><p className="left ">{this.state.contadorCarrito}</p></small></Link></span>
                        <p><b>Precio: </b>{producto.precio}</p>
                        <p><b>Disponibles: </b>{this.state.disponible ? this.state.disponible : 'Agotado'}</p>
                        <div className="input-group">
                            <div className="file-field input-field">
                                <button onClick={this.agregarProducto.bind(this)} className="btn input waves-effect waves-light " type="button" disabled={(producto.disponible <= 0) ? true : false} ><i className="material-icons">add_shopping_cart</i></button>
                                <div className="file-path-wrapper">
                                    <input type="number" value={this.state.inputValue} disabled={(producto.disponible <= 0) ? true : false} min="0" max={producto.disponible} className="form-control right-align" onChange={evt => this.updateInputValue(evt)} ></input>
                                </div>
                            </div>
                        </div>
                   </div> 
                </div>    
                </div>
            </div>
                <p className="col s12 m8 l4 right">{producto.informacion}</p>
            </div>
        )
    }

    agregarProducto(){
        let cantidad = this.state.inputValue
        const producto = this.props.producto
        if(cantidad <= 0){
            alert('Seleccione una cantidad disponible!!')
            return
        }
        if(this.state.disponible < cantidad){
            alert('Maxima cantidad es: '+this.state.disponible)
        }
        else{
            let disponibles = (Number(this.state.disponible) - Number(cantidad))
            let agregarACarrito = (Number(this.state.contadorCarrito) + Number(cantidad))
            this.setState({disponible : disponibles})
            this.setState({contadorCarrito : agregarACarrito})
            this.state.productoCarrito.id = producto.id
            this.state.productoCarrito.descripcion = producto.descripcion
            this.state.productoCarrito.imagen = producto.imagen
            this.state.productoCarrito.precio = producto.precio
            this.state.productoCarrito.cantidad = (Number(this.state.productoCarrito.cantidad) + Number(cantidad))
            this.props.actualizarDisponible(this.state.productoCarrito, cantidad, false)
        }
    }

    updateInputValue(evt){
        this.setState({
            inputValue: evt.target.value
        })
    }

    checkCarrito(producto){
        for(let itemCarrito of this.state.listaCarrito){
            if(itemCarrito.id == producto.id){
                let actualizarDisponible = (Number(this.state.disponible) - Number(itemCarrito.cantidad))
                this.setState({disponible : actualizarDisponible, contadorCarrito : itemCarrito.cantidad})
            }
        }
    }
}
