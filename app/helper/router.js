// Variables ==================================================================
const Router = require('electron-router')
const url = require('url')
const ejse = require('ejs-electron')
const informacion = require('../informacion.js')
const configuracion = require('./configuracion')
const auth = require('../usuarios/auth.js')
const isOnline = require('is-online')
const sincronizar = require('./sincronizar')
// Configuracion ==============================================================
let router = Router('MAIN')
// Funciones ==================================================================
function init(ventana) {
  router.get('/', (req, res) => {
    configuracion.ValidarLogin()
    .then(respuesta => {
      if(respuesta === true) {
        var data = {FCatalogos : informacion.FCatalogos(), FUbicaciones : informacion.FUbicaciones(), Documentados : informacion.Documentados(), Sincronizados : informacion.Sincronizados(), PorcDocSync : informacion.PorcDocSync(), FActivos : informacion.FActivos()}
        Enrutar(ventana, 'app/dashboard/index.ejs', data)
      }
      else {
        EnrutaLogin()
      }
    })
    .catch(err => {
      console.log(err)
    })
  }) // END GET /

  router.get('/login', (req,res) => {
    configuracion.ValidarLogin()
    .then(respuesta => {
      if(respuesta === true) {
        router.route('GET','/', ( err, result ) => {})
      }
      else {
        var data = {}
        Enrutar(ventana, 'app/usuarios/login.ejs', data)
      }
    })
    .catch(err => {
      console.log(err)
    })
  }) // END GET /login

  router.post('/login', (req,res) => {
    auth.login(req.params[0], req.params[1])
  }) // END POST /login

  router.get('/logout', (req,res) => {
    auth.logout()
  }) // END GET /logout

  router.get('/levantamiento', (req,res) => {
    configuracion.ValidarLogin()
    .then(respuesta => {
      if(respuesta === true) {
        var data = {grupos : informacion.grupos(), paises: informacion.paises(), plantas : informacion.plantas(), ubicaciones : informacion.ubicaciones() }
        Enrutar(ventana, 'app/activos/levantamiento.ejs', data)
      }
      else {
        EnrutaLogin()
      }
    })
    .catch(err => {
      console.log(err)
    })
  }) // END GET /levantamiento

  router.get('/listado', (req,res) => {
    configuracion.ValidarLogin()
    .then(respuesta => {
      if(respuesta === true) {
        var data = {datos: informacion.Activos()}
        Enrutar(ventana, 'app/activos/listado.ejs', data)
      }
      else {
        EnrutaLogin()
      }
    })
    .catch(err => {
      console.log(err)
    })
  }) // END GET /levantamiento

  router.post('/levantamiento', (req,res) => {
    console.log(req.params)
    informacion.guardar(req.params[0], req.params[1], req.params[2])
  }) // END POST /levantamiento

  router.get('/sincronizar', (req,res) => {
    configuracion.ValidarLogin()
    .then(respuesta => {
      if(respuesta === true) {
        var data = {FCatalogos : informacion.FCatalogos(), FUbicaciones : informacion.FUbicaciones(), FActivos : informacion.FActivos()}
        Enrutar(ventana, 'app/sincronizar/index.ejs', data)
      }
      else {
        EnrutaLogin()
      }
    })
    .catch(err => {
      console.log(err)
    })
  }) // END GET /sincronizar

  router.get('/synccatalogos', (req,res) => {
    sincronizar.Catalogos()
  }) // END GET /synccatalogos

  router.get('/syncubiare', (req,res) => {
    sincronizar.Ubicaciones()
  }) // END GET /syncubiare

  router.get('/syncactivos', (req,res) => {
    sincronizar.Activos()
    sincronizar.Imagenes()
  }) // END GET /syncactivos

  router.route('GET','/login', ( err, result ) => {})
} // END init

function Enrutar(ventana, dir, informacion) {
  ejse.data(informacion)
  ventana.loadURL(url.format({
    pathname: dir,
    protocol: 'file:',
    slashes: true
  }))
} // END Enrutar

function EnrutaLogin() {
  router.route('GET','/login', ( err, result ) => {})
} // END EnrutaLogin

// Exportacion ================================================================
module.exports.init = init;
