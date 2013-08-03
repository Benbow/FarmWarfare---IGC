var DB = require('./DB');
var User = require('./User');
var $ = require('jquery');

var Map = (function() {
	// "private" variables
	var _DB;
	var _table = "Tiles";

	// constructor
	function Map(){
		_DB = new DB();
	};

	Map.prototype.initialiseMap = function() { 
        
		var i = 1,j = 1, rh = 0, rf = 0, count = 0;
		var randhum = Math.floor((Math.random()*100)+1);
		var randfert = Math.floor((Math.random()*100)+1);

		var mapGeneration = setInterval(function(){
			var connection = _DB.connection();
			if(i == 1){
				if(j == 1){
					rh = randhum;
					rf = randfert;
					nextStep(i, j, rh, rf, function(){
						if(j == 50)
						{
							if(i == 50)
							{
								console.log('done');
								clearInterval(mapGeneration);
							}
							i++;
							j=1;
						}else{
							j++;
						}
					});
				}else{
					rh = makeTilesPropertyByLeft(rh);
					rf = makeTilesPropertyByLeft(rf);
					nextStep(i, j, rh, rf, function(){
						if(j == 50)
						{
							if(i == 50)
							{
								console.log('done');
								   clearInterval(mapGeneration);
							}
							i++;
							j=1;
						}else{
							j++;
						}
					});
				}
			}else{
				if(j == 1){
					makeTilesPropertyByUp(i, j,function(retour){
						rh = retour[0];
						rf = retour[1];
						nextStep(i, j, rh, rf, function(){
							if(j == 50)
							{
								if(i == 50)
								{
									console.log('done');
									clearInterval(mapGeneration);
								}
								i++;
								j=1;
							}else{
								j++;
							}
						});
					});
				}else{
					makeTilesPropertyByLeftAndUp(i, j, function(retour){
						rh = retour[0];
						rf = retour[1];
						nextStep(i, j, rh, rf, function(){
							if(j == 50)
							{
								if(i == 50)
								{
									console.log('done');
									clearInterval(mapGeneration);
								}
								i++;
								j=1;
							}else{
								j++;
							}
						});
					});
					
				}
			}
		},20);
	};


	Map.prototype.saveMap = function(x,y,id) {
	
		var connection = _DB.connection();
		connection.query('UPDATE Tiles SET x=' + x + ' y=' + y + 'sprite_id=' + id + ' ;' , function(err,rows,fields){
			if(err) throw err;
		});
	};


	Map.prototype.getMap = function(user,callback) { 
		var connection = _DB.connection();
        var user_id = user.getId();
        var user_alliance = user.getUserAlliance();
		var user_pseudo = user.getPseudo();
		var string_map = {
			'map' : '',
			'storage' : {},
            'maison' : {},
            'emptyStorage' : {},
            'crops' : {},
			'user' : {},
            'infos_user': {},
			'all_user' : {},
			'enemi_tile' : {},
            'own_tile' : {},
            'alliance_tile' : {},
            'allies' : {}
		};
        string_map.infos_user = {
            'id' : user_id,
            'pseudo' : user_pseudo
        };
		connection.query('SELECT * FROM Tiles ORDER BY `Tiles`.`y` ASC', function(err,rows,fields){
			if(err) throw err;
			var check = 0;
			var own_check = 0;
            var enemi_check = 0;
            var alliance_check = 0;
			for(var i = 0;i < rows.length;i++)
			{
				if(user_id == rows[i].owner){
					string_map.map += ((rows[i].sprite_id == 1) ? 2 : rows[i].sprite_id) + ((check < 50) ? "," : ((rows[i].x == 50) ? "" : ":"));
					string_map.own_tile[own_check] = {
						'x': rows[i].x,
						'y': rows[i].y
					};
					own_check++;
				}else if ($.inArray(rows[i].owner,user_alliance) >= 0){
                    string_map.map += ((rows[i].sprite_id == 1) ? 6 : rows[i].sprite_id) + ((check < 49) ? "," : ((rows[i].x == 49) ? "" : ":"));
                    string_map.alliance_tile[alliance_check] = {
                        'x': rows[i].x,
                        'y': rows[i].y
                    };
                    alliance_check++;
                }else if(user_id != rows[i].owner && rows[i].owner != null){
					string_map.map += ((rows[i].sprite_id == 1) ? 3 : rows[i].sprite_id) + ((check < 50) ? "," : ((rows[i].x == 50) ? "" : ":"));
					string_map.enemi_tile[enemi_check] = {
						'x': rows[i].x,
						'y': rows[i].y,
                        'id': rows[i].owner
					};
					enemi_check++;

                }else
                    string_map.map += rows[i].sprite_id + ((check < 49) ? "," : ((rows[i].x == 49) ? "" : ":"));

				if(check == 49)
				{
					check = -1;
				}
			   check++;
			}
		});
        connection.query('SELECT t.x as x, t.y as y, s.stockages_spec_id as id, s.origin_tile_id as origin FROM Stockages as s LEFT JOIN Tiles as t ON s.tile_id = t.id', function(err,rows,fields){
            if(err) throw err;
            for(var i = 0;i < rows.length;i++)
            {
                string_map.storage[i] = {
                    'x': rows[i].x,
                    'y': rows[i].y,
                    'id': rows[i].id,
                    'origin' : rows[i].origin,
                };
            }
        });

         connection.query('SELECT t.x as x, t.y as y FROM Maisons as m LEFT JOIN Tiles as t ON m.tile_id = t.id', function(err,rows,fields){
            if(err) throw err;
            for(var i = 0;i < rows.length;i++)
            {
                string_map.maison[i] = {
                    'x': rows[i].x,
                    'y': rows[i].y
                };
            }
        });

        this.getUserTile(user_id,function(data){
            string_map.user = data;
        });

        connection.query('SELECT t.x as x, t.y as y, u.pseudo as pseudo, u.id as id FROM Users_Connected as uc LEFT JOIN Users as u ON uc.user_id = u.id LEFT JOIN Tiles as t ON uc.user_id = t.user_id WHERE uc.isConnected = 1',function(err,rows,fields){
            if(err) throw err;

            for(var i = 0;i < rows.length;i++)
            {
                if(rows[i].pseudo != user.getPseudo())
                    string_map.all_user[i] = {
                        'x': rows[i].x,
                        'y': rows[i].y,
                        'pseudo': rows[i].pseudo,
                        'id': rows[i].id
                    };
            }
        });
        
        connection.query('SELECT alliance_id FROM Users WHERE id = '+user_id, function(err,rows,fields){
            if(err) throw err;
            if(rows[0].alliance_id != null && rows[0].alliance_id > 0){
                connection.query('SELECT id FROM Users WHERE alliance_id = '+rows[0].alliance_id, function(err,rows,fields){
                    if(err) throw err;
                    for(var k = 0;k < rows.length;k++)
                    {
                        string_map.allies[rows[k].id] = rows[k].id;
                    }
                    callback(string_map);
                });
            }else {
                string_map.allies[user_id] = user_id;
                callback(string_map);
            }
        });

    };

    Map.prototype.getOwnerTile = function(id,callback)
    {
        var connection = _DB.connection();
        connection.query('SELECT owner FROM Tiles WHERE id = ' + id, function(err,rows,fields){
            if(err) throw err;
            
            callback(rows[0].owner);
        });
    }

    Map.prototype.getIdTile = function(x,y,callback)
    {
        var connection = _DB.connection();
        connection.query('SELECT id FROM Tiles WHERE x = ' + x + ' AND y = ' + y, function(err,rows,fields){
            if(err) throw err;
            
            callback(rows[0].id);
        });
    }
    Map.prototype.getCoordTile = function(id,callback)
    {
        var connection = _DB.connection();
        connection.query('SELECT * FROM Tiles WHERE id = '+id, function(err,rows,fields){
            if(err) throw err;
            callback({
                x : rows[0].x ,
                y : rows[0].y
            });
        });
    }

    Map.prototype.getUserTile = function(id, callback)
    {
        var connection = _DB.connection();
        var data = {
            'x': 1,
            'y': 1           
        }
        connection.query('SELECT * FROM Tiles WHERE user_id = ' + id, function(err,rows,fields){
            if(err) throw err;

            if(rows.length > 0)
            {
                data.x = rows[0].x;
                data.y = rows[0].y;               
            }

            callback(data);
        });
    }

    Map.prototype.getInfosTile = function(id,callback){
        var connection = _DB.connection();
        var data = new Array();

        connection.query('SELECT * FROM Tiles WHERE id = '+id, function(err,rows,fields){
            if(err) throw err;

            data = {
                'fertilite' : rows[0].fertilite,
                'humidite'  : rows[0].humidite,
                'id'        : rows[0].id
            };

            callback(data);
        });
    };
    

	Map.prototype.canConquer = function(tile_id, user_id, callback)
	{
		var connection = _DB.connection();

		connection.query('SELECT * FROM Tiles WHERE owner = ' + user_id + ' AND id = ' + tile_id, function(err,rows,fields){
			if(err) throw err;

			if(rows.length > 0)
				callback(false);
			else
				callback(true);
		});
	}

    function makeTilesPropertyByLeft(value){
        var plusOuMoins = Math.floor((Math.random()*2)+1);
        var val = Math.floor((Math.random()*20)+1);

        if(plusOuMoins == 1){
            var retour = value + val;
            if(retour > 100)
                retour = 100;
            return retour;
        }else if(plusOuMoins == 2){
            var retour = value - val;
            if(retour < 0)
                retour = 0;
            return retour;
        }
    }

    function makeTilesPropertyByLeftAndUp(i, j, callback){
        var connection = _DB.connection();
        var xleft = j-1;
        var yup = i-1;

        tileLeft = recupTileLeft(xleft, i, function (tileLEFT){
            var tL = tileLEFT;
            tileUp = recupTileUp(yup, j, function (tileUP){
                var tU = tileUP
                var retour = new Array();

                var tileL = tL;
                var tileU = tU;

                // détermination de la valeur d'humidite de la nouvelle tile
                if(tileL[0] > tileU[0]){
                    var min = tileL[0] - 20;
                    var max = tileU[0] + 20;
                    if(min < 0) min = 0;
                    if(max > 100) max = 100;
                    var val = Math.floor(Math.random()*(max-min+1)+min);
                    retour[0] = val;

                }else if(tileL[0] < tileU[0]){
                    var max = tileL[0] + 20;
                    var min = tileU[0] - 20;
                    if(min < 0) min = 0;
                    if(max > 100) max = 100;
                    var val = Math.floor(Math.random()*(max-min+1)+min);
                    retour[0] = val;
                }
                else if (tileL[0] == tileU[0]){
                    var max = tileL[0] + 10;
                    var min = tileU[0] - 10;
                    if(min < 0) min = 0;
                    var val = Math.floor(Math.random()*(max-min+1)+min);
                    retour[0] = val;
                }

                // détermination de la valeur de fertilite de la nouvelle tile
                if(tileL[1] > tileU[1]){
                    var min = tileL[1] - 20;
                    var max = tileU[1] + 20;
                    if(min < 0) min = 0;
                    if(max > 100) max = 100;
                    var val = Math.floor(Math.random()*(max-min+1)+min);
                    retour[1] = val;

                }else if(tileL[1] < tileU[1]){
                    var max = tileL[1] + 20;
                    var min = tileU[1] - 20;
                    if(min < 0) min = 0;
                    if(max > 100) max = 100;
                    var val = Math.floor(Math.random()*(max-min+1)+min);
                    retour[1] = val;
                }
                else if (tileL[1] == tileU[1]){
                    var max = tileL[1] + 10;
                    var min = tileU[1] - 10;
                    if(min < 0) min = 0;
                    if(max > 100) max = 100;
                    var val = Math.floor(Math.random()*(max-min+1)+min);
                    retour[1] = val;
                }


                //vérification des extrèmes
                if(retour[0] > 100)
                    retour[0] = 100;
                if(retour[0] < 0)
                    retour[0] = 0;
                if(retour[1] > 100)
                    retour[1] = 100;
                if(retour[1] < 0)
                    retour[1] = 0;

                callback(retour);

            });
        });
    }

    function makeTilesPropertyByUp(i, j, callback){
        var tileUp = new Array();
        var retour = new Array();
        var yup = i-1;

        //récupération du tile au dessus
       
        tileUp = recupTileUp(yup, j, function (tile){
            var plusOuMoins = Math.floor((Math.random()*2)+1);
            var val = Math.floor((Math.random()*20)+1);

            if(plusOuMoins == 1){
                retour[0] = tile[0] + val;
                if(retour[0] > 100)
                    retour[0] = 100;
            }else if(plusOuMoins == 2){
                retour[0] = tile[0] - val;
                if(retour[0] < 0)
                    retour[0] = 0;
            }
            
            var plusOuMoins = Math.floor((Math.random()*2)+1);
            var val = Math.floor((Math.random()*20)+1);

            if(plusOuMoins == 1){
                retour[1] = tile[1] + val;
                if(retour[1] > 100)
                    retour[1] = 100;
            }else if(plusOuMoins == 2){
                retour[1] = tile[1] - val;
                if(retour[1] < 0)
                    retour[1] = 0;
            }
            callback(retour);
        });     

    }

    function recupTileUp(yup, j, callback){
        var connection = _DB.connection();
        var tileUp = new Array();

        var tile = connection.query('SELECT * FROM Tiles WHERE x = ' + yup +' AND y = ' + j + ' ;', function(err,rows,fields){
            if(err) throw err;

            tileUp[0] = rows[0].humidite;
            tileUp[1] = rows[0].fertilite;
            callback(tileUp);
        });
    }

    function recupTileLeft(xleft, i, callback){
        var connection = _DB.connection();
        var tileLeft = new Array();

        var tile = connection.query('SELECT * FROM Tiles WHERE x = ' + i +' AND y =' + xleft + ' ;', function(err,rows,fields){
            if(err) throw err;
            tileLeft[0] = rows[0].humidite;
            tileLeft[1] = rows[0].fertilite;
            callback(tileLeft);
        });
    }

    function nextStep(i, j, rh, rf, callback){
        var connection = _DB.connection();
        var sprite_id = 1;
        connection.query('INSERT INTO Tiles (id,x,y, humidite, fertilite, sprite_id) VALUES("","' + i + '","' + j + '","' + rh + '","' + rf + '","' + sprite_id + '");');
        callback('ok');
    }

    return Map;
})();

module.exports = Map;
