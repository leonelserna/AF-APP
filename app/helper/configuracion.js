// Variables ==================================================================
const settings = require('electron-settings')

// Configuracion ==============================================================

// Funciones ==================================================================
function AgregarUsuario(informacion) {
  settings.set('user', {
    id : informacion.ID,
    email: informacion.email,
    nombre: informacion.Nombre,
    Apellidos: informacion.Apellidos,
    empresa: informacion.empresaid,
    rol: informacion.rol,
    estatus: informacion.estatus,
    auth: true
  })
} // END AgregarUsuario

function QuitarUsuario() {
  settings.set('user', {
    id : '',
    email: '',
    nombre: '',
    Apellidos: '',
    empresa: '',
    rol: '',
    estatus: '',
    auth: false
  })
} // END QuitarUsuario

function ValidarLogin() {
  return new Promise((resolve, reject) => {
    if(settings.has('user.auth'))
    {
      if(settings.get('user.auth') === true)
      {
        return resolve(true)
      }
      else {
        return resolve(false)
      }
    }
    else {
      return resolve(false)
    }
  })

} // END ValidarLogin

function obtenerPropiedad(propiedad) {
  return new Promise((resolve, reject) => {
    if(settings.has(propiedad))
    {
      return resolve(settings.get(propiedad))
    }
    else {
      return reject('No cuenta con la propiedad')
    }
  })

} // END obtenerPropiedad

// Exportacion ================================================================
module.exports.AgregarUsuario = AgregarUsuario;
module.exports.QuitarUsuario = QuitarUsuario;
module.exports.ValidarLogin = ValidarLogin;
module.exports.obtenerPropiedad = obtenerPropiedad;
