// Variables ==================================================================
const low = require('lowdb')
const rlow = require('lowdb-recursive')
const FileSync = require('lowdb/adapters/FileSync')
const moment = require('moment')
// Configuracion ==============================================================

// Funciones ==================================================================
function init(archivo, estructura) {
  var adapter = new FileSync(archivo)
  var db = low(adapter)
  db.defaults(estructura).write();
} // END init

function Todos(archivo, rama, patron) {
  return new Promise((resolve, reject) => {
    var db = rlow(archivo)
    var informacion = db(rama).findAll(patron)
    return resolve(informacion)
  })
} // END Todos

function Actualizar(archivo, rama, patron, valores) {
  return new Promise((resolve, reject) => {
    var adapter = new FileSync(archivo)
    var db = low(adapter)
    db.get(rama).find(patron).assign(valores).write()
    db.set('fsync.fecha', moment().format('L')).write();
    return resolve(true)
  })
} // END Actualizar

function Agregar(archivo, rama, informacion) {
  var adapter = new FileSync(archivo)
  var db = low(adapter)
  db.get(rama).push(informacion).last().write();
} // END Agregar

function Reiniciar(archivo) {
  var adapter = new FileSync(archivo)
  var db = low(adapter)
  var estado = {}
  db.setState(estado)
}

function Fecha(archivo) {
  var adapter = new FileSync(archivo)
  var db = low(adapter)
  db.set('fsync.fecha', moment().format('L')).write();
}

function Buscar(archivo, rama, parametros) {
  var adapter = new FileSync(archivo)
  var db = low(adapter)
  db.get('posts').find({ id: postId }).value()
}

// Exportacion ================================================================
module.exports.Todos = Todos;
module.exports.Actualizar = Actualizar;
module.exports.init = init;
module.exports.Agregar = Agregar;
module.exports.Reiniciar = Reiniciar;
module.exports.Fecha = Fecha;
