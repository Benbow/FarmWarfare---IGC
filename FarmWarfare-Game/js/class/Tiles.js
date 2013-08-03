var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor',
    database : 'farmDB',
});
//Classe qui enregistre les Tiles de chaque user

var Tiles = (function() {
    var _id;            //id unique d'une arme INT
    var _x;             //coord en x INT
    var _y;             //coord en y INT
    var _isEmpty        //booleen de vérification de tile libre TinyINT
    var _sprite_id;     //id du sprite image de la tile INT
    var _humidite;      //indicateur d'humidite INT
    var _fertilite;     //indicateur de fertilité INT
    var _isVisible;     //indicateur de Tile Avtive TinyINT
    var _user_id;       //lien vers l'user a qui appartient la arme INT
   

    function Tiles(){
        
    };

    Tiles.prototype.Watering = function(tile_id, user_id, callback){
        var query = 'SELECT * FROM Arrosoirs WHERE user_id ='+user_id+' AND isActive = 1;';
        connection.query(query,function(err, row, fields) {
            if (err) throw err;
            if( typeof( row[0].current ) != "undefined" && row[0].current != 0){
                query = 'SELECT * FROM Tiles where id ='+tile_id+';';
                connection.query(query,function(err, rows, fields) {
                    if (err) throw err;
                    var h = rows[0].humidite +10;
                    query = 'UPDATE Tiles SET humidite = '+h+' WHERE id ='+tile_id+';';
                    connection.query(query,function(err, rows, fields) {
                        if (err) throw err;
                        var c = row[0].current - 1;
                        query = 'UPDATE Arrosoirs SET current = '+c+' WHERE user_id ='+user_id+' AND isActive = 1;';
                        connection.query(query,function(err, rows, fields) {
                            if (err) throw err;
                            callback(true);
                        });
                    });
                });
            }else{
                callback(false);
            }
        }); 
    };

    Tiles.prototype.Fertilizing = function(tile_id, user_id, callback){
        var query = 'SELECT * FROM Users where id ='+user_id+';';
        connection.query(query,function(err, row, fields) {
            if (err) throw err;
            if( typeof( row[0].nb_fertilisants ) != "undefined" && row[0].nb_fertilisants != 0){
                query = 'SELECT * FROM Tiles where id ='+tile_id+';';
                connection.query(query,function(err, rows, fields) {
                    if (err) throw err;
                    var f = rows[0].fertilite +10;
                    query = 'UPDATE Tiles SET fertilite = '+f+' WHERE id ='+tile_id+';';
                    connection.query(query,function(err, rows, fields) {
                        if (err) throw err;
                        var nb = row[0].nb_fertilisants - 1;
                        query = 'UPDATE Users SET nb_fertilisants = '+nb+' WHERE id ='+user_id+';';
                        connection.query(query,function(err, rows, fields) {
                            if (err) throw err;
                            callback(true);
                        });
                    });
                });
            }else{
                callback(false);
            }
        }); 
    };

    Tiles.prototype.Harvesting = function(tile_id, user_id, callback){
        var query = 'SELECT * FROM Plantes where tile_id ='+tile_id+' AND status >= 4;';
        connection.query(query,function(err, row, fields) {
            if (err) throw err;
            if( typeof( row[0]) != "undefined"){
                query = 'SELECT * FROM Graines_spec where id ='+row[0].graines_spec_id+';';
                connection.query(query,function(err, rows, fields) {
                    if (err) throw err;
                    var f = rows[0].fertilite +10;
                    nb_fruits = Math.ceil((row[0].health * rows[0].production)/100);

                    query = 'DELETE FROM Plantes WHERE tile_id = ' + tile_id + ';';
                    connection.query(query,function(err, r, fields) {
                        if (err) throw err;
                        connection.query('UPDATE Tiles SET sprite_id = 1, isEmpty = 0 WHERE id = '+tile_id,function(err, r, fields) {
                            if(err) throw err;
                            callback({
                                ok: true,
                                nb: nb_fruits,
                                fruit: row[0].graines_spec_id
                            });
                        });
                    });
                });
            }else{
                callback(false);
            }
        }); 
    };

    Tiles.prototype.DestroyCrops = function(user_id, tile_id, callback){
        var query = 'SELECT * FROM Plantes WHERE user_id = '+user_id+' AND tile_id = ' + tile_id + ';';
        connection.query(query,function(err, r, fields) {
            if (err) throw err;
            if(typeof(r[0]) != 'undefined'){
                query = 'DELETE FROM Plantes WHERE user_id = '+user_id+' AND tile_id = ' + tile_id + ';';
                connection.query(query,function(err, r, fields) {
                    if (err) throw err;
                    connection.query('UPDATE Tiles SET sprite_id = 1, isEmpty = 0 WHERE id = '+tile_id,function(err, r, fields) {
                        if (err) throw err;
                        callback(true);
                    });
                });
            }else{
                callback(false);
            }
        }); 
    }
    
    Tiles.prototype.DestroyBuilding = function(user_id, tile_id, callback){
        var query = 'SELECT * FROM Stockages WHERE user_id = '+user_id+' AND tile_id = ' + tile_id + ';';
        connection.query(query,function(err, r, fields) {
            if (err) throw err;
            if(typeof(r[0]) != 'undefined'){
                if(r[0].origin_tile_id == null){
                    console.log('test');
                    query = 'DELETE FROM Stockages WHERE user_id = '+user_id+' AND tile_id = ' + tile_id + ';';
                    connection.query(query,function(err, rows, fields) {
                        if (err) throw err;
                        connection.query('UPDATE Tiles SET sprite_id = 1, isEmpty = 0 WHERE id = '+tile_id,function(err, row, fields) {
                            if (err) throw err;
                            callback({
                                type : r[0].stockages_spec_id,
                                id : tile_id
                            });
                        });
                    });
                }else{
                    query = 'DELETE FROM Stockages WHERE user_id = '+user_id+' AND tile_id = ' + r[0].origin_tile_id + ';';
                    connection.query(query,function(err, rows, fields) {
                        if (err) throw err;
                        connection.query('UPDATE Tiles SET sprite_id = 1, isEmpty = 0 WHERE id = '+r[0].origin_tile_id,function(err, row, fields) {
                            if (err) throw err;
                            callback({
                                type : r[0].stockages_spec_id,
                                id : r[0].origin_tile_id
                            });
                        });
                    });
                }
            }else{
                callback(false);
            }
        }); 
    }

    Tiles.prototype.DestroyBuildingComplex = function(origin_id, callback){
        var query = 'SELECT * FROM Stockages WHERE origin_tile_id = '+origin_id+';';
        connection.query(query,function(err, r, fields) {
            console.log(r);
            if(typeof(r[0]) != 'undefined'){
                DestroyForComplexBuilding(origin_id, r.length, r, function(){
                    callback(true);
                });
            }
        });
    };

    function DestroyForComplexBuilding(origin_id, nb, stockages, callback){
        var i = 0;
        while(i < nb){
            DestroyForComplexBuilding2(stockages[i].tile_id, origin_id);
            i++;
        }
        callback(true);
    };

    function DestroyForComplexBuilding2(tile_id, origin_id){
        query = 'DELETE FROM Stockages WHERE tile_id = ' + tile_id + ';';
        connection.query(query,function(err, r, fields) {
            if (err) throw err;
        });
        connection.query('UPDATE Tiles SET sprite_id = 1, isEmpty = 0 WHERE id = '+tile_id,function(err, r, fields) {
            if (err) throw err;
        });
    };

    Tiles.prototype.getTileInfos = function(x, y, callback){
        var query = 'SELECT * FROM Tiles WHERE x = '+x+' AND y = ' + y + ';';
        connection.query(query,function(err, rows, fields) {
            if(typeof(rows[0]) != "undefined"){
                callback(rows[0]);
            }else{
                callback(false);
            }

        });
    };

    Tiles.prototype.checkEmpty = function(id, callback){
        var query = 'SELECT * FROM Tiles WHERE id ='+id+';';
         connection.query(query,function(err, rows, fields) {
            if(typeof(rows[0]) != "undefined"){
                if(rows[0].isEmpty == 0){
                    callback(true);
                }
                else{
                    callback(false);
                }
            }else{
                callback(false);
            }
        });
    };

    Tiles.changeSprite = function(x,y,sprite_id){
        connection.query('UPDATE Tiles SET sprite_id = '+sprite_id+' WHERE x = '+x+' AND y = '+y, function(err,rows,fields){
            if(err) throw err;
        });

    };

    Tiles.changeOwner = function(x,y,owner){
        connection.query('UPDATE Tiles SET owner = '+owner+' WHERE x = '+x+' AND y = '+y, function(err,rows,fields){
            if(err) throw err;
        });

    };

    Tiles.prototype.updateFertiliteAndHumidite = function(){
        var upd = setInterval(function(){
            var query = 'UPDATE Tiles SET fertilite = fertilite+1 WHERE isEmpty  = 0 AND fertilite < 100;';
            connection.query(query, function(err,rows,fields){
                if(err) throw err;
                var query = 'UPDATE Tiles SET humidite = humidite-1 WHERE humidite > 0;';
                connection.query(query, function(err,rows,fields){
                    if(err) throw err;
                });
            });
        },(60000));
    };

    Tiles.prototype.createGame = function(user_id,difficulty, callback){
        var query = 'SELECT * FROM Tiles WHERE owner IS NULL';
        connection.query(query, function(err, rows, fields){
            if(err) throw err;
            if(typeof(rows[0]) != 'undefined'){
                var rand = Math.floor((Math.random()*(rows.length))+1);
                console.log(rows[rand].id);
                query = 'UPDATE Tiles SET owner = '+user_id+', user_id='+user_id+' WHERE id ='+rows[rand].id+';';
                connection.query(query, function(err, row, fields){
                    if(err) throw err;
                    var argent = 300/difficulty;
                    query = 'UPDATE Users SET argent = '+argent+', energies=50, life = 50  WHERE id ='+user_id+';';
                    connection.query(query, function(err, row, fields){
                        if(err) throw err;
                        connection.query('INSERT INTO Armes (armes_spec_id, user_id) VALUES(1,' + user_id +');', function(err, row, fields){if(err) throw err;});
                        connection.query('INSERT INTO Maisons (tile_id, user_id) VALUES('+rows[rand].id+',' + user_id +');', function(err, row, fields){if(err) throw err;});
                        connection.query('INSERT INTO Arrosoirs (arrosoirs_spec_id, isActive, current, user_id) VALUES(1,1,0,' + user_id +');', function(err, row, fields){
                            if(err) throw err;
                            callback(true);
                        });
                    });
                });
            }else{
                callback(false);
            }
        });
    };

    Tiles.prototype.deleteGame = function(user_id, callback){
        var query = 'DELETE FROM Alliance_invit WHERE to_user_id = '+user_id+';';
        connection.query(query, function(err, rows, fields){
            var query = 'DELETE FROM Armes WHERE user_id = '+user_id+';';
            connection.query(query, function(err, rows, fields){
                var query = 'DELETE FROM Arrosoirs WHERE user_id = '+user_id+';';
                connection.query(query, function(err, rows, fields){
                    var query = 'DELETE FROM Fruits WHERE user_id = '+user_id+';';
                    connection.query(query, function(err, rows, fields){
                        var query = 'DELETE FROM Graines WHERE user_id = '+user_id+';';
                        connection.query(query, function(err, rows, fields){
                            var query = 'DELETE FROM Maisons WHERE user_id = '+user_id+';';
                            connection.query(query, function(err, rows, fields){
                                var query = 'DELETE FROM Stockages WHERE user_id = '+user_id+';';
                                connection.query(query, function(err, rows, fields){
                                    var query = 'UPDATE Tiles SET user_id = NULL, owner = NULL WHERE user_id = '+user_id+' OR owner='+user_id+';';
                                    connection.query(query, function(err, rows, fields){
                                        var query = 'UPDATE Users SET nb_fertilisants = 0, energies = 0, niveau = 1, alliance_id = NULL, argent = 0, experience = 0  WHERE id = '+user_id+';';
                                        connection.query(query, function(err, rows, fields){
                                            if(err) throw err;
                                            callback(true);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    //Getters
    Tiles.prototype.getId = function() {
        return _id;
    };
    Tiles.prototype.getX = function() {
        return _x;
    };
    Tiles.prototype.getY = function() {
        return _y;
    };
    Tiles.prototype.getIsEmpty = function() {
        return _isEmpty;
    };
    Tiles.prototype.getSpriteId = function() {
        return _sprite_id;
    };
    Tiles.prototype.getHumidite = function() {
        return _humidite;
    };
    Tiles.prototype.getFertilite = function() {
        return _fertilite;
    };
    Tiles.prototype.getIsVisible = function() {
        return _isVisible;
    };
    Tiles.prototype.getUserId = function() {
        return _user_id;
    };
    

    //Setters
    Tiles.prototype.setId = function(id) {
        _id = id;
    };
    Tiles.prototype.setX = function(x) {
        _x = x;
    };
    Tiles.prototype.setY = function(y) {
        _y = y;
    };
    Tiles.prototype.setIsEmpty = function(isEmpty) {
        _isEmpty = isEmpty;
    };
    Tiles.prototype.setSpriteId = function(sprite_id) {
        _sprite_id = sprite_id;
    };
    Tiles.prototype.setHumidite = function(humidite) {
        _humidite = humidite;
    };
    Tiles.prototype.setFertilite = function(fertilite) {
        _fertilite = fertilite;
    };
    Tiles.prototype.setIsVisible = function(isVisible) {
        _isVisible = isVisible;
    };
    Tiles.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };

    return Tiles;
})();

module.exports = Tiles;
