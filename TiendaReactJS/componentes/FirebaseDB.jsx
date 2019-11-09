import React from 'react'
import ReactDom from 'react-dom'
import * as firebase from 'firebase'

const listaUsuarios : Object = [];

const firebaseConfig = {
    apiKey: "AIzaSyBwl6Zk4af1P3IBn8a0KU8dFFUyQ8Kj_Yc",
    authDomain: "angulartienda-78c78.firebaseapp.com",
    databaseURL: "https://angulartienda-78c78.firebaseio.com",
    projectId: "angulartienda-78c78",
    storageBucket: "angulartienda-78c78.appspot.com",
    messagingSenderId: "135842409683",
    appId: "1:135842409683:web:8604ce4c48af5b4e"
  };
  firebase.initializeApp(firebaseConfig)

  const productosDb = firebase.database().ref().child('productos')
  const usuariosDb = firebase.database().ref().child('usuarios')

  usuariosDb.orderByChild("id").on("child_added", function(snapshot){
      listaUsuarios.push(snapshot.key)
  })