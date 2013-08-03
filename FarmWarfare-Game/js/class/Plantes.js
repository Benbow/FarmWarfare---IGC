var DB = require('./DB');
var Graines_spec = require('./Graines_spec');

//Classe qui enregistre les Plantes de chaque user

var Plantes = (function() {
	var _id;                //id unique d'une arme INT
	var _croissance;        //indicateur de croissance de la plante INT
	var _health;            //indicateur de santé de la plante INT
	var _status;            //indicateur de santé de la plante INT
	var _user_id;           //lien vers l'user a qui appartient la arme INT
	var _plantes_spec_id;   //lien vers le bon type de arme INT
	var _tile_id;           //lien ver la tile de la plante INT
	var _DB;
	var _tile_humidite;
	var _tile_fertilite;

	function Plantes(){
		_DB = new DB();
	};

	Plantes.prototype.Add_Plantes = function(croissance, user_id, graines_spec_id, tile_id, humidite, fertilite, callback){
		var connection = _DB.connection();

		_tile_fertilite = fertilite;
		_tile_humidite = humidite;

		var health = (humidite + fertilite) / 2;

		this.setCroissance(croissance);
		this.setHealth(health);
		this.setUserId(user_id);
		this.setStatus(0);
		this.setPlantesSpecId(graines_spec_id);
		this.setTileId(tile_id);
		this.setHumidite(humidite);
		this.setFertilite(fertilite);

		var query = 'INSERT INTO Plantes (croissance, health, user_id, graines_spec_id, tile_id, created_at, updated_at) VALUES ('+croissance+', '+health+', '+user_id+', '+graines_spec_id+', '+tile_id+', "'+getTimeDb()+'", "'+getTimeDb()+'");';

		connection.query(query,function(err, rows, fields) {
			if (err) throw err;
			connection.query('UPDATE Tiles SET isEmpty = 1 WHERE id ='+tile_id+';', function(err,rows,fields){  
				connection.query('UPDATE Graines SET nb = nb-1 WHERE user_id ='+user_id+' AND graines_spec_id = '+graines_spec_id+';', function(err,rows,fields){
					callback(true);
					console.log('Plantes created !');
				});
			});
		});
	};

	Plantes.prototype.updatePlante = function(callback){
		var connection = _DB.connection();
		var statu = this.getStatus(),
			humi = this.getHumidite(),
			ferti = this.getFertilite(),
			idTile = this.getTileId();

		this.getInfosGraine(function(graine_infos){
			var refresh = setInterval(function(){
				var testPresence = true;
				connection.query('SELECT * FROM Plantes WHERE tile_id = '+idTile, function(err,rows,fields){
					if(err) throw err;
					if(rows.length > 0)
					{
						statu++;
						if(statu > 5)
						{
							clearInterval(refresh);
							callback({
								type :"delete", 
								status : statu,
								id : graine_infos.id
							});
						}
						else
						{
							((ferti - 13) < 0) ? ferti = 0 : (ferti -= 13);
							((humi - 13) < 0) ? humi = 0 : (humi -= 13);
							var health = (humi + ferti) / 2;
							var croissance = statu * 20;
							//if(health >= graine_infos.sante_min || statu == 5){
								connection.query('UPDATE Tiles SET fertilite = '+ ferti +', humidite = "'+ humi +'" WHERE id = ' + idTile, function(err,rows,fields){
									if(err) throw err;
								});
							
								connection.query('UPDATE Plantes SET status = '+statu+', updated_at = "'+getTimeDb()+'", health = '+health+', croissance ='+croissance+' WHERE tile_id = ' + idTile, function(err,rows,fields){
									if(err) throw err;
								});
							/*}else{
								statu--;
							}*/
							
							callback({
								type :"update", 
								status : statu,
								id : graine_infos.id
							});
						}   
					}
					else
					{
						clearInterval(refresh);
					}
						
				});

				
			},(graine_infos.croissance*1000));
			
		});
	};

	Plantes.prototype.updateCropsHealths = function(callback){
		var connection = _DB.connection();
		var query = 'SELECT * FROM Plantes;';
		connection.query(query, function(err, rows, fields){
			if(err) throw err;
			if(typeof(rows[0]) != 'undefined'){
				updateHealths(rows, function(){
					callback(true)
				});
			}else{
				callback(false);
			}
		});
	};

	function updateHealths(plantes, callback){
		var nb = plantes.length;
		var i = 0;
		while(i < nb){
			updateHealth(plantes[i]);
			i++;
		}
		callback(true);
	};

	function updateHealth(plante){
		var connection = _DB.connection();
		var query = 'SELECT * FROM Tiles WHERE id = '+plante.tile_id+';';
		connection.query(query, function(err, rows, fields){
			if(err) throw err;
			if(typeof(rows[0]) != 'undefined'){
				var health = (rows[0].humidite + rows[0].fertilite) / 2;
				query = 'UPDATE Plantes SET health = '+health+' WHERE id ='+plante.id+';';
				connection.query(query, function(err, rows, fields){
					if(err) throw err;
				});
			}
		});
	};

	Plantes.prototype.getInfosGraine = function(callback){
		var connection = _DB.connection();
		var query = 'SELECT * FROM Graines_spec WHERE id = '+this.getPlantesSpecId();
		connection.query(query,function(err, rows, fields) {
			if (err) throw err;
			callback(rows[0]);
		});
	};

	Plantes.prototype.getInfosPlantes = function(tile_id, callback){
		var connection = _DB.connection();
		var query = 'SELECT * FROM Plantes WHERE tile_id = '+tile_id+';';
		connection.query(query,function(err, rows, fields) {
			if(typeof(rows[0]) != "undefined"){
				callback(rows[0]);
			}else{
				callback(false);
			}
		});
	}

	//Getters
	Plantes.prototype.getId = function() {
		return this._id;
	};
	Plantes.prototype.getCroissance = function() {
		return this._croissance;
	};
	Plantes.prototype.getHealth = function() {
		return this._health;
	};
	Plantes.prototype.getStatus = function() {
		return this._status;
	};
	Plantes.prototype.getUserId = function() {
		return this._user_id;
	};
	Plantes.prototype.getPlantesSpecId = function() {
		return this._plantes_spec_id;
	};
	Plantes.prototype.getTileId = function() {
		return this._tile_id;
	};
	Plantes.prototype.getHumidite = function() {
		return this._tile_humidite;
	};
	Plantes.prototype.getFertilite = function() {
		return this._tile_fertilite;
	};


	//Setters
	Plantes.prototype.setId = function(id) {
		this._id = id;
	};
	Plantes.prototype.setCroissance = function(croissance) {
		this._croissance = croissance;
	};
	Plantes.prototype.setHealth = function(health) {
		this._health = health;
	};
	Plantes.prototype.setStatus = function(status) {
		this._status = status;
	};
	Plantes.prototype.setUserId = function(user_id) {
		this._user_id = user_id;
	};
	Plantes.prototype.setPlantesSpecId = function(plantes_spec_id) {
		this._plantes_spec_id = plantes_spec_id;
	};
	Plantes.prototype.setTileId = function(tile_id) {
		this._tile_id = tile_id;
	};
	Plantes.prototype.setHumidite = function(tile_humidite) {
		this._tile_humidite = tile_humidite;
	};
	Plantes.prototype.setFertilite = function(tile_fertilite) {
		this._tile_fertilite = tile_fertilite;
	};

	return Plantes;
})();

module.exports = Plantes;


getTimeDb = function(){
	var d = new Date();
	var years   = d.getFullYear(),
		month   = ((d.getMonth() + 1).toString().length > 1) ? (d.getMonth() + 1) : '0'+(d.getMonth() + 1),
		day     = ((d.getDate()).toString().length > 1) ? d.getDate() : '0'+d.getDate(),
		hours   = ((d.getHours()).toString().length > 1) ? d.getHours() : '0'+d.getHours(),
		minute  = ((d.getMinutes()).toString().length > 1) ? d.getMinutes() : '0'+d.getMinutes(),
		seconde = ((d.getSeconds()).toString().length > 1) ? d.getSeconds() : '0'+d.getSeconds();
	var db_date = years+'-'+month+'-'+day+' '+hours+':'+minute+':'+seconde;

	return db_date;
}