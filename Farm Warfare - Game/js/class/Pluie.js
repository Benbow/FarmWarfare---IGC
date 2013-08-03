var DB = require('./DB');

//Classe qui enregistre les Pluie de chaque user

var Pluie = (function() {
    var _id;                //id unique d'une arme INT
    var _isActive           //détermine si l'évènement naturel est actif TinyINT
    var _origin_tile_id;    //lien vers l'user a qui appartient la arme INT
    var _longueur;          //longeur de la zone affectée INT
    var _largeur;           //largeur de la zone affectée INT
    var _duree;             //durée de l'évènement INT
    var _x;                 //coordonée en X de l'origine INT
    var _y;                 //coordonée en Y de l'origine INT

    function Pluie(){
        _DB = new DB();
    };

    Pluie.prototype.Add_Raining = function(tile_id, duree, longueur, largeur, x, y, callback){
        var pluie = new Array();
        for( var i = 0; i < longueur; i++){
            for(var j = 0; j < largeur; j++){
                pluie.push({
                    x : x+i,
                    y : y+j
                });
            }
        }
        var connection = _DB.connection();
        connection.query('INSERT INTO Pluie(origin_tile_id, duree, longueur, largeur, x, y, isActive) VALUES('+tile_id+', '+duree+', '+longueur+', '+largeur+', '+x+', '+y+', 1)', function(err, rows, fields){
            if(err) throw err;
            callback(pluie);
        });
    };

    Pluie.prototype.isRaining = function(callback){
        var connection = _DB.connection();
        var intervalRain = setInterval(function(){
            connection.query('SELECT * FROM Pluie WHERE isActive = 1', function(err, rows, fields){
                if(err) throw err;
                if(rows[0] != null){
                    if(rows[0].duree > 0){
                            var xmax = rows[0].x + rows[0].longueur -1;
                            var ymax = rows[0].y + rows[0].largeur -1;
                        connection.query('UPDATE Tiles SET humidite = 100 WHERE x >= '+rows[0].x+' AND x <= '+xmax+' AND y >='+rows[0].y+' AND y <= '+ymax, function(err, row, fields){
                            if(err) throw err;
                            connection.query('UPDATE Pluie SET duree = duree-1 WHERE id='+rows[0].id, function(err, row, fields){
                                if(err) throw err;
                                callback(false);
                            });
                        });
                    }else{
                        connection.query('DELETE FROM Pluie WHERE id='+rows[0].id, function(err, row, fields){
                            if(err) throw err;
                            var pluie = new Array();
                            for( var i = 0; i < rows[0].longueur; i++){
                                for(var j = 0; j < rows[0].largeur; j++){
                                    pluie.push({
                                        x : rows[0].x+i,
                                        y : rows[0].y+j
                                    });
                                }
                            }
                            callback(pluie);
                        });
                    }
                }else{
                    callback(false);
                }
            })
        },(10000));
    };

    //Getters
    Pluie.prototype.getId = function() {
        return _id;
    };
    Pluie.prototype.getIsActive = function() {
        return _isActive;
    };
    Pluie.prototype.getOriginTileId = function() {
        return _origin_tile_id;
    };
    Pluie.prototype.getLongueur = function() {
        return _longueur;
    };
    Pluie.prototype.getLargeur = function() {
        return _largeur;
    };
    Pluie.prototype.getDuree = function() {
        return _duree;
    };
    Pluie.prototype.getX = function() {
        return _x;
    };
    Pluie.prototype.getY = function() {
        return _y;
    };


    //Setters
    Pluie.prototype.setId = function(id) {
        _id = id;
    };
    Pluie.prototype.setIsActive = function(isActive) {
        _isActive = isActive;
    };
    Pluie.prototype.setOriginTileId = function(origin_tile_id) {
        _origin_tile_id = origin_tile_id;
    };
    Pluie.prototype.setLongueur = function(longueur) {
        _longueur = longueur;
    };
    Pluie.prototype.setLargeur = function(largeur) {
        _largeur = largeur;
    };
    Pluie.prototype.setDuree = function(duree) {
        _duree = duree;
    };
    Pluie.prototype.setX = function(x) {
        _x = x;
    };
    Pluie.prototype.setY = function(y) {
        _y = y;
    };
    

    return Pluie;
})();

module.exports = Pluie;
