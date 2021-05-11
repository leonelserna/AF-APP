// Variables ==================================================================
const mysql = require('../helper/mysql')
const FileSync = require('lowdb/adapters/FileSync')
const configuracion = require('../helper/configuracion')
const low = require('../helper/lowdb')
const fs = require('fs')
const _ = require('underscore')
const moment = require('moment')
const Router = require('electron-router')
const Client = require('ftp')
// Configuracion ==============================================================
let router = Router('SYNC')
var catalogos = 'catalogos.json'
var ubicaciones = 'ubicaciones.json'
var activos = 'activos.json'
var estructuraActivos = {activos: [], imagenes: [], fsync : {}}
var estructuraCatalogos = {paises: [], resultados: [], tipos: [], fsync : {}}
var estructuraUbicaciones = {plantas: [], ubicaciones: [], fsync : {}}
var urlUploads = "http://localhost/ActivoFijo/uploads/fotos/"
var empresa = ""

var configFTP = {
  host: 'localhost',
  port : '21',
  user : 'usuario',
  password : 'Vash1992'
}

configuracion.obtenerPropiedad('user.empresa')
.then(informacion => {
  empresa = informacion
  console.log(empresa)
})
.catch(err => {
  console.log(err)
})


init()
// Funciones ==================================================================

function init() {
  low.init('activos.json',estructuraActivos)
  low.init('catalogos.json',estructuraCatalogos)
  low.init('ubicaciones.json',estructuraUbicaciones)
}

function Activos() {
  var rama = 'activos'
  var patron = {"sync" : "false"}

  low.Todos(activos, rama, patron)
  .then(informacion => {
    _.each(informacion, function(caso) {

      var sqlCaso = "SELECT NoCaso FROM activofijo where idEmpresa = '3' ORDER BY NoCaso DESC limit 1"
      mysql.Query(sqlCaso)
      .then(resultado => {
        var NoCaso = resultado[0].NoCaso
        NoCaso = Number(NoCaso) + 1

        var sql = "INSERT INTO activofijo (idEmpresa,idPlataforma,NoCaso, Descripcion, Marca, Modelo, Serie, PaisOrigen, Observacion, Grupo, Planta, Ubicacion) VALUES (" + "'" + empresa + "','" + caso.id + "','" + NoCaso + "','" + caso.descripcion + "','" + caso.Marca + "','" + caso.Modelo + "','" + caso.Serie + "','"  + caso.PaisOrigen + "','" + caso.Observacion + "','"  + caso.Grupo + "','"  + caso.Planta + "','"  + caso.Ubicacion + "')"
        mysql.NonQuery(sql)
        .then(resultado => {
          var buscar = { id: caso.id }
          var valores = { sync: "true"}
          low.Actualizar(activos, rama, buscar, valores)
          .then(resultado => {
            console.log(resultado)
          })
          .catch(err => {
            console.log(err)
          })
        })
        .catch(err => {
          console.log(err)
        })
      })
    })
  })
  .catch(err => {
    console.log(err)
  })

  low.Fecha(activos)

} // END Activos

function Catalogos() {
  low.Reiniciar(catalogos)
  low.init(catalogos, estructuraCatalogos)
  sql = "SELECT * FROM cat_pais"
  mysql.Query(sql)
  .then(informacion => {
    _.each(informacion, function(fila) {
      var datos = {id: fila.ID, pais: fila.PAIS}
      low.Agregar(catalogos, 'paises', datos)
    })
  })
  .catch(err => {
    console.log(err)
  })

  sql = "SELECT * FROM cat_resultado"
  mysql.Query(sql)
  .then(informacion => {
    _.each(informacion, function(fila) {
      var datos = {id: fila.ID, concepto: fila.Concepto}
      low.Agregar(catalogos, 'resultados', datos)
    })
  })
  .catch(err => {
    console.log(err)
  })

  sql = "SELECT * FROM cat_tipoactivo"
  mysql.Query(sql)
  .then(informacion => {
    _.each(informacion, function(fila) {
      var datos = {id: fila.ID, concepto: fila.Concepto}
      low.Agregar(catalogos, 'tipos', datos)
    })
  })
  .catch(err => {
    console.log(err)
  })

  low.Fecha(catalogos)
  router.route('GET','/sincronizar', ( err, result ) => {})
} // END Catalogos

function Ubicaciones() {
  low.Reiniciar(ubicaciones)
  low.init(ubicaciones, estructuraUbicaciones)

  sql = "SELECT * FROM empresa_ubicacion where idEmpresa = '" + empresa + "'"
  mysql.Query(sql)
  .then(informacion => {
    _.each(informacion, function(fila) {
      var datos = {id: fila.ID, ubicacion: fila.Nombre}
      low.Agregar(ubicaciones, 'plantas', datos)
    })
  })
  .catch(err => {
    console.log(err)
  })

  sql = "SELECT * FROM ubicacion_area where idUbicacion IN (SELECT ID FROM empresa_ubicacion where idEmpresa = '" + empresa + "')"
  mysql.Query(sql)
  .then(informacion => {
    _.each(informacion, function(fila) {
      var datos = {id: fila.ID, ubicacion: fila.Nombre}
      low.Agregar(ubicaciones, 'ubicaciones', datos)
    })
  })
  .catch(err => {
    console.log(err)
  })

  low.Fecha(ubicaciones)
  router.route('GET','/sincronizar', ( err, result ) => {})
} // END Ubicaciones

function Imagenes() {
  var c = new Client()

  low.Todos(activos, 'imagenes', {})
  .then(informacion => {
    c.on('ready', function() {
      _.each(informacion, function(fila) {
        var direccion = './app/fotos/' + fila.imagen;
        c.put(direccion, fila.imagen, function(err) {
          if(err) throw err
          var sql = "SELECT * FROM activofijo where idPlataforma = '" + fila.id + "'"
          mysql.Query(sql)
          .then(informacion => {
            var idCaso = informacion[0].NoCaso;

            sql = "INSERT INTO activofijo_imagenes (idEmpresa, idCaso, Imagen) VALUES('" + empresa + "','"  + idCaso + "','" + urlUploads + fila.imagen + "')"
            mysql.Query(sql)
            .then(informacion => {

            })
            .catch(err => {
              console.log(err)
            })
          })
          .catch(err => {
            console.log(err)
          })
        })
      })
      c.end()
    })
  })
  .catch(err => {
    console.log(err)
  })
  c.connect(configFTP)
} // END Imagenes

// Exportacion ================================================================
module.exports.Activos = Activos;
module.exports.Catalogos = Catalogos;
module.exports.Ubicaciones = Ubicaciones;
module.exports.Imagenes = Imagenes;
