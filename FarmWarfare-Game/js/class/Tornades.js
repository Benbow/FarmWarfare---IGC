//Classe qui enregistre les Tornades de chaque user

var Tornades = (function() {
    var _id;                //id unique d'une arme INT
    var _isActive           //détermine si l'évènement naturel est actif TinyINT
    var _origin_tile_id;    //lien vers l'user a qui appartient la arme INT
    var _vectorX;           //vecteur de déplacement en X
    var _vectorY;           //vecteur de déplacement en Y
    var _longueur;          //longeur de la zone affectée INT
    var _largeur;           //largeur de la zone affectée INT
    var _duree;             //durée de l'évènement INT
    var _x;                 //coordonée en X de l'origine INT
    var _y;                 //coordonée en Y de l'origine INT

    function Tornades(){
        
    };

    Tornades.prototype.Add_Tornade = function(tile_id, duree, longueur, largeur, x, y, vectorX, vectorY, callback){
        var tornade = new Array();
        for( var i = 0; i < longueur; i++){
            for(var j = 0; j < largeur; j++){
                tornade.push({
                    x : x+i,
                    y : y+j
                });
            }
        }
        var connection = _DB.connection();
        connection.query('INSERT INTO Tornades(origin_tile_id, duree, longueur, largeur, x, y, vectorX, vectorY, isActive) VALUES('+tile_id+', '+duree+', '+longueur+', '+largeur+', '+x+', '+y+', '+vectorX+', '+vectorY+', 1)', function(err, rows, fields){
            if(err) throw err;
            callback(tornade);
        });
    };

    Tornades.prototype.isTornades = function(callback){
        var connection = _DB.connection();
        var intervalTornade = setInterval(function(){
            connection.query('SELECT * FROM Tornades WHERE isActive = 1', function(err, rows, fields){
                if(err) throw err;
                if(rows[0] != null){
                    if(rows[0].duree > 0){
                        var xmax = rows[0].x + rows[0].longueur -1;
                        var ymax = rows[0].y + rows[0].largeur -1;
                        connection.query('DELETE p.* FROM Plantes as p LEFT JOIN Tiles as t ON p.tile_id = t.id WHERE t.x >= '+rows[0].x+' AND t.x <= '+xmax+' AND t.y >='+rows[0].y+' AND t.y <= '+ymax, function(err, row, fields){
                            if(err) throw err;
                            connection.query('DELETE s.* FROM Stockages as s LEFT JOIN Tiles as t ON s.tile_id = t.id WHERE t.x >= '+rows[0].x+' AND t.x <= '+xmax+' AND t.y >='+rows[0].y+' AND t.y <= '+ymax, function(err, row, fields){
                                if(err) throw err;
                                connection.query('UPDATE Tornades SET duree = duree-1, x = x+'+rows[0].vectorX+', y = y +'+rows[0].vectorY+' WHERE id='+rows[0].id, function(err, row, fields){
                                    if(err) throw err;
                                    connection.query('UPDATE Tiles SET isEmpty = 0, sprite_id = 1 WHERE x >= '+rows[0].x+' AND x <= '+xmax+' AND y >='+rows[0].y+' AND y <= '+ymax, function(err, row, fields){
                                        if(err) throw err;
                                        var tornade = new Array();
                                        for( var i = 0; i < rows[0].longueur; i++){
                                            for(var j = 0; j < rows[0].largeur; j++){
                                                tornade.push({
                                                    x : rows[0].x+i,
                                                    y : rows[0].y+j,
                                                    newx : rows[0].x+i+rows[0].vectorX,
                                                    newy : rows[0].y+i+rows[0].vectorY,
                                                });
                                            }
                                        }
                                        callback(tornade);
                                    });
                                });
                            });
                        });
                    }else{
                        connection.query('DELETE FROM Tornades WHERE id='+rows[0].id, function(err, row, fields){
                            if(err) throw err;
                            var tornade = new Array();
                            for( var i = 0; i < rows[0].longueur; i++){
                                for(var j = 0; j < rows[0].largeur; j++){
                                    tornade.push({
                                        x : rows[0].x+i,
                                        y : rows[0].y+j
                                    });
                                }
                            }
                            callback(tornade);
                        });
                    }
                }else{
                    callback(false);
                }
            })
        },(2000));
    };

    //Getters
    Tornades.prototype.getId = function() {
        return _id;
    };
    Tornades.prototype.getIsActive = function() {
        return _isActive;
    };
    Tornades.prototype.getOriginTileId = function() {
        return _origin_tile_id;
    };
    Tornades.prototype.getVectorX = function() {
        return _vectorX;
    };
    Tornades.prototype.getVectorY = function() {
        return _vectorY;
    };
    Tornades.prototype.getLongueur = function() {
        return _longueur;
    };
    Tornades.prototype.getLargeur = function() {
        return _largeur;
    };
    Tornades.prototype.getDuree = function() {
        return _duree;
    };
    Tornades.prototype.getX = function() {
        return _x;
    };
    Tornades.prototype.getY = function() {
        return _y;
    };


    //Setters
    Tornades.prototype.setId = function(id) {
        _id = id;
    };
    Tornades.prototype.setIsActive = function(isActive) {
        _isActive = isActive;
    };
    Tornades.prototype.setOriginTileId = function(origin_tile_id) {
        _origin_tile_id = origin_tile_id;
    };
    Tornades.prototype.setVectorX = function(vectorX) {
        _vectorX = vectorX;
    };
    Tornades.prototype.setVectorY = function(vectorY) {
        _vectorY = vectorY;
    };
    Tornades.prototype.setLongueur = function(longueur) {
        _longueur = longueur;
    };
    Tornades.prototype.setLargeur = function(largeur) {
        _largeur = largeur;
    };
    Tornades.prototype.setDuree = function(duree) {
        _duree = duree;
    };
    Tornades.prototype.setX = function(x) {
        _x = x;
    };
    Tornades.prototype.setY = function(y) {
        _y = y;
    };
    

    return Tornades;
})();

module.exports = Tornades;
