// Variables ==================================================================
var mysql = require('mysql')

// Configuracion ==============================================================
var configuracion = {
  'host': 'localhost',
  'user': 'root',
  'password': '',
  'database': 'eusaga'
}
// Funciones ==================================================================
function Query(sql) {
  return new Promise((resolve, reject) => {
    var conexion = mysql.createConnection(configuracion)

    conexion.connect(function(err) {
      if(!err) {
        console.log('Conectado a la base de datos')
      }
      else {
        console.log('Error al conectarse a la base de datos')
        return reject(err)
      }
    })

    conexion.query('USE ' + configuracion.database)

    conexion.query(sql, function(err,rows,fields) {
      conexion.end()
      if(!err) {
        return resolve(rows)
      }
      else {
        console.log('Error al realizar peticion')
        return reject(err)
      }
    })
  })
} // END Query

function NonQuery(sql) {
  return new Promise((resolve, reject) => {
    var conexion = mysql.createConnection(configuracion)

    conexion.connect(function(err) {
      if(!err) {
        console.log('Conectado a la base de datos')
      }
      else {
        console.log('Error al conectarse a la base de datos')
        return reject(err)
      }
    })

    conexion.query('USE ' + configuracion.database)

    conexion.query(sql, function(err,rows,fields) {
      conexion.end()
      if(!err) {
        return resolve(true)
      }
      else {
        console.log('Error al realizar peticion')
        return reject(false)
      }
    })
  })
} // END NonQuery

// Exportacion ================================================================
module.exports.Query = Query;
module.exports.NonQuery = NonQuery;
