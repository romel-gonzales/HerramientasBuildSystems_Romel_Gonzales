import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {Router} from '@angular/router';
import { exists } from 'fs';

//-----------  import Servicios--------------
import {AuthService} from "../../servicios/auth.service"

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    elementos: FirebaseListObservable<any[]>;
    email: string;
    password: string;
    mensaje: string;
    listado: any[];
    test: string;

  constructor(
    private db: AngularFire,
    private auth: AuthService,
    private router: Router
    ) { 
      if(this.auth.validarSesion()){
        this.router.navigate(['tienda'])
      }

  }

  ngOnInit() {
    this.email = ""
    this.password = ""
    if(this.auth.validarSesion()){
      this.router.navigate(['/tienda'])
    }

    this.loginForm = new FormGroup({
      'email' : new FormControl('', Validators.required),
      'password' : new FormControl('', Validators.required)
    })
  }

  validarLogin(){
    if(this.loginForm.valid)
    {
      let incr : number = 0
      let correo = this.loginForm.value.email; 
      let password = this.loginForm.value.password;      
      this.db.database.list('/usuarios').subscribe(listado => {
        this.listado = listado;
        let listusuarios = JSON.parse(JSON.stringify(this.listado))
        
        listusuarios.forEach(element => {
          if(element.usuario === correo && element.clave === password)
          {
            incr = incr+1
            //console.log("Credenciales "+element.usuario+" y clave "+element.clave+" son validas");            
            sessionStorage.setItem("Session", this.loginForm.value.email)
            this.router.navigate(['tienda'])
          } 
        });
        //console.log('login value = '+incr)   
        if(incr == 0)
        { this.mensaje = 'Credenciales de inicio de sesion erroneas!!!'}    
      });

    }
  }

}

