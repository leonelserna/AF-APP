// Variables ==================================================================
const Router = require('electron-router')
const mysql = require('../helper/mysql')
const configuracion = require('../helper/configuracion')
const sha256 = require("sha256")

// Configuracion ==============================================================
let router = Router('LOGIN')

// Funciones ==================================================================

function login(usuario, contrasena) {
  var hash = sha256(contrasena)
  var sql = "SELECT * FROM usuario WHERE email = '" + usuario + "'"

  mysql.Query(sql)
  .then(usuario => {
    if(!usuario.length) {
      return
    }

    if(hash === usuario[0].contrasena) {
      configuracion.AgregarUsuario(usuario[0])
      router.route('GET','/', ( err, result ) => {})
    }
    else {
      router.route('GET','/login', ( err, result ) => {})
    }
  })
  .catch(err => {
    console.log(err)
  })
} // END login

function logout() {
  configuracion.QuitarUsuario()
  router.route('GET','/login', ( err, result ) => {})
} // END logout

// Exportacion ================================================================
module.exports.login = login;
module.exports.logout = logout;
