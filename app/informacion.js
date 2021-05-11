// Variables ======================================================================
var low = require('lowdb');
var rlow = require('lowdb-recursive')
var FileSync = require('lowdb/adapters/FileSync')
const configuracion = require('./helper/configuracion')
var _ = require('underscore')

// Funciones Guardado =============================================================
function guardar(datos, imagenes, id){
	var adapter = new FileSync('activos.json')
	var db = low(adapter)
	db.defaults({ activos: [] }).write()
	var empresa = ""
	configuracion.obtenerPropiedad('user.empresa')
	.then(informacion => {
		empresa = informacion
		db.get('activos').push(datos).last().assign({sync: 'false', idEmpresa :  empresa}).write()
	})
	.catch(err => {
		console.log(err)
	})

	_.each(imagenes, function(imagen) {
		db.get('imagenes').push({"id" : id, "imagen" : imagen}).last().write()
	})
}

// Funciones consulta catalogos ===================================================
function grupos() {
	var adapter = new FileSync('catalogos.json');
	var db = low(adapter);
	var info = db.get('tipos').value();
	return info
}

function paises() {
	var adapter = new FileSync('catalogos.json');
	var db = low(adapter);
	var info = db.get('paises').value();
	return info
}

function resultados() {
	var adapter = new FileSync('catalogos.json');
	var db = low(adapter);
	var info = db.get('resultados').value();
	return info
}

function plantas() {
	var adapter = new FileSync('ubicaciones.json');
	var db = low(adapter);
	var info = db.get('plantas').value();
	return info
}

function ubicaciones() {
	var adapter = new FileSync('ubicaciones.json');
	var db = low(adapter);
	var info = db.get('ubicaciones').value();
	return info
}

function FCatalogos() {
	var adapter = new FileSync('catalogos.json');
	var db = low(adapter);
	var info = db.get('fsync').value();
	return info
}

function FUbicaciones() {
	var adapter = new FileSync('ubicaciones.json');
	var db = low(adapter);
	var info = db.get('fsync').value();
	return info
}

function FActivos() {
	var adapter = new FileSync('activos.json');
	var db = low(adapter);
	var info = db.get('fsync').value();
	return info
}

function Documentados() {
	var adapter = new FileSync('activos.json');
	var db = low(adapter);
	db.defaults({ activos: [] }).write();
	var info = db.get('activos').size().value()
	return info
}

function Sincronizados() {
	var rdb = rlow('activos.json')
	var info = rdb('activos').findAll({'sync' : "true"})
	var tamano = _.size(info)
	return tamano
}

function PorcDocSync() {
	var adapter = new FileSync('activos.json');
	var db = low(adapter);
	db.defaults({ activos: [] }).write();
	var doc = db.get('activos').size().value()
	var rdb = rlow('activos.json')
	var sync = rdb('activos').findAll({'sync' : "true"})
	var synct = _.size(sync)

	var porc = (100 * synct) / doc

	return Math.round(porc)
}

function Activos() {
	var adapter = new FileSync('activos.json');
	var db = low(adapter);
	var info = db.get('activos').value();
	return info
}

module.exports.grupos = grupos;
module.exports.paises = paises;
module.exports.resultados = resultados;
module.exports.plantas = plantas;
module.exports.ubicaciones = ubicaciones;
module.exports.guardar = guardar;
module.exports.FCatalogos = FCatalogos;
module.exports.FUbicaciones = FUbicaciones;
module.exports.FActivos = FActivos;
module.exports.Documentados = Documentados;
module.exports.Sincronizados = Sincronizados;
module.exports.PorcDocSync = PorcDocSync;
module.exports.Activos = Activos;
