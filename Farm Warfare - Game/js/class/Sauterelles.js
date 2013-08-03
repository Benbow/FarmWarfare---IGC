//Classe qui enregistre les Sauterelles de chaque user

var Sauterelles = (function() {
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

    function Sauterelles(){
        
    };

    Sauterelles.prototype.Add_Sauterelles = function(tile_id, duree, longueur, largeur, x, y, vectorX, vectorY, callback){
        var sauterelles = new Array();
        for( var i = 0; i < longueur; i++){
            for(var j = 0; j < largeur; j++){
                sauterelles.push({
                    x : x+i,
                    y : y+j
                });
            }
        }
        var connection = _DB.connection();
        connection.query('INSERT INTO Sauterelles(origin_tile_id, duree, longueur, largeur, x, y, vectorX, vectorY, isActive) VALUES('+tile_id+', '+duree+', '+longueur+', '+largeur+', '+x+', '+y+', '+vectorX+', '+vectorY+', 1)', function(err, rows, fields){
            if(err) throw err;
            callback(sauterelles);
        });
    };

    Sauterelles.prototype.isSauterelles = function(callback){
        var connection = _DB.connection();
        var intervalSauterelle = setInterval(function(){
            connection.query('SELECT * FROM Sauterelles WHERE isActive = 1', function(err, rows, fields){
                if(err) throw err;
                if(rows[0] != null){
                    if(rows[0].duree > 0){
                        var xmax = rows[0].x + rows[0].longueur -1;
                        var ymax = rows[0].y + rows[0].largeur -1;
                        connection.query('DELETE p.* FROM Plantes as p LEFT JOIN Tiles as t ON p.tile_id = t.id WHERE t.x >= '+rows[0].x+' AND t.x <= '+xmax+' AND t.y >='+rows[0].y+' AND t.y <= '+ymax, function(err, row, fields){
                            if(err) throw err;
                            connection.query('UPDATE Sauterelles SET duree = duree-1, x = x+'+rows[0].vectorX+', y = y +'+rows[0].vectorY+' WHERE id='+rows[0].id, function(err, row, fields){
                                if(err) throw err;
                                connection.query('UPDATE Tiles SET isEmpty = 0, sprite_id = 1 WHERE x >= '+rows[0].x+' AND x <= '+xmax+' AND y >='+rows[0].y+' AND y <= '+ymax+' AND isEmpty != 2', function(err, row, fields){
                                    if(err) throw err;
                                    var sauterelles = new Array();
                                    for( var i = 0; i < rows[0].longueur; i++){
                                        for(var j = 0; j < rows[0].largeur; j++){
                                            sauterelles.push({
                                                x : rows[0].x+i,
                                                y : rows[0].y+j,
                                                newx : rows[0].x+i+rows[0].vectorX,
                                                newy : rows[0].y+i+rows[0].vectorY,
                                            });
                                        }
                                    }
                                    callback(sauterelles);
                                });
                            });
                        });
                    }else{
                        connection.query('DELETE FROM Sauterelles WHERE id='+rows[0].id, function(err, row, fields){
                            if(err) throw err;
                            var sauterelles = new Array();
                            for( var i = 0; i < rows[0].longueur; i++){
                                for(var j = 0; j < rows[0].largeur; j++){
                                    sauterelles.push({
                                        x : rows[0].x+i,
                                        y : rows[0].y+j
                                    });
                                }
                            }
                            callback(sauterelles);
                        });
                    }
                }else{
                    callback(false);
                }
            })
        },(2000));
    };

    //Getters
    Sauterelles.prototype.getId = function() {
        return _id;
    };
    Sauterelles.prototype.getIsActive = function() {
        return _isActive;
    };
    Sauterelles.prototype.getOriginTileId = function() {
        return _origin_tile_id;
    };
    Sauterelles.prototype.getVectorX = function() {
        return _vectorX;
    };
    Sauterelles.prototype.getVectorY = function() {
        return _vectorY;
    };
    Sauterelles.prototype.getLongueur = function() {
        return _longueur;
    };
    Sauterelles.prototype.getLargeur = function() {
        return _largeur;
    };
    Sauterelles.prototype.getDuree = function() {
        return _duree;
    };
    Sauterelles.prototype.getX = function() {
        return _x;
    };
    Sauterelles.prototype.getY = function() {
        return _y;
    };


    //Setters
    Sauterelles.prototype.setId = function(id) {
        _id = id;
    };
    Sauterelles.prototype.setIsActive = function(isActive) {
        _isActive = isActive;
    };
    Sauterelles.prototype.setOriginTileId = function(origin_tile_id) {
        _origin_tile_id = origin_tile_id;
    };
    Sauterelles.prototype.setVectorX = function(vectorX) {
        _vectorX = vectorX;
    };
    Sauterelles.prototype.setVectorY = function(vectorY) {
        _vectorY = vectorY;
    };
    Sauterelles.prototype.setLongueur = function(longueur) {
        _longueur = longueur;
    };
    Sauterelles.prototype.setLargeur = function(largeur) {
        _largeur = largeur;
    };
    Sauterelles.prototype.setDuree = function(duree) {
        _duree = duree;
    };
    Sauterelles.prototype.setX = function(x) {
        _x = x;
    };
    Sauterelles.prototype.setY = function(y) {
        _y = y;
    };
    

    return Sauterelles;
})();

module.exports = Sauterelles;
