import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http'
import {Router} from '@angular/router'

@Injectable()
export class AuthService {

  constructor(private router: Router,
              private http: Http
              )
  { }

  logout()     
  {
    sessionStorage.removeItem('Session')
    this.router.navigate(['login'])
  }  

  validarSesion(){
    return sessionStorage.getItem("Session")
  }

}
