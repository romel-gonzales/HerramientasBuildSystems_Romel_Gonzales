import React from 'react'
import ReactDom from 'react-dom'
import * as firebase from 'firebase'
import * as request from 'superagent'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'

//---------------   Importacion de Componentes ---------------------------
import LoginFirebase from './FirebaseDB.jsx'

const USUARIODB = firebase.database().ref().child('usuarios')

class LoginForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            mensaje: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.checkLogin = this.checkLogin.bind(this)
    }

    checkSession(){
        return sessionStorage.getItem("Session")
    }

    handleChange(event){
        if(event.target.id == "email"){
            this.setState({email: event.target.value})
        }
        if(event.target.id == "password"){
            this.setState({password: event.target.value})
        }
    }

    checkLogin(event){
        event.preventDefault()

        let objetoUsuarios
        let isLogged = 0
        let email = this.state.email.toLowerCase()
        let emailId = email.replace(/[^a-zA-Z 0-9.]+/g,'').replace(/\./g,'')
        //console.log('emailId_ :'+emailId)
        let password = this.state.password
        let mensajeLogin = ''


        let listaUsuarios = firebase.database().ref('/').child('usuarios')
        listaUsuarios.on('value', snapshot =>{
            //console.log('valores consultados tabla usuarios: '+JSON.stringify(snapshot.val()))
            objetoUsuarios = snapshot.val()
        })

        for(let i in objetoUsuarios){

           // console.log('userData_ :'+objetoUsuarios[i].usuario)

            if(objetoUsuarios[i].usuario == email){
                //console.log('Email correcto: '+objetoUsuarios[i].usuario)
                if(objetoUsuarios[i].clave == password){
                    mensajeLogin = "Iniciando Sesion"
                    sessionStorage.setItem("Session", email)
                    isLogged = 1
                }
            }
            else{
                mensajeLogin = "Las credenciales no son correctas"
            }
        }
        this.setState({mensaje : mensajeLogin})
        //console.log(mensajeLogin)
    }

    render(){
        if(this.checkSession()){
            return <Redirect to='/tienda'/>
        }

        return(
            <div className="login row">
                <div className="col s6 form-container animated fadeIn slow">
                    <form onSubmit={this.checkLogin}>
                        <h4 className="text-center white-text">Inicio de Sesion</h4>
                        <div className="col s12 input-field">
                            <input type="email" ref="email" id="email" value={this.state.email} onChange={this.handleChange} placeholder="" className="validate white-text" required aria-required="true"/>
                            <label htmlFor="email" data-error="Error en direccion email" data-success="Formato email correcto">Correo Electronico</label>
                        </div>
                        <div className="col s12 input-field">
                            <input type="password" ref="password" id="password" value={this.state.password} onChange={this.handleChange} placeholder="" className="validate white-text" required aria-required="true"/>
                            <label htmlFor="password" data-error="Contraseña no puede estar vacia" className="white-text">Contraseña</label>
                        </div>
                        <div className="col s12 center-align">
                            <div className="mensaje">
                                {this.state.mensaje}
                            </div>
                            <button type="submit" className="btn btn-success">Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default LoginForm
