//Classe qui enregistre les Meteor de chaque user

var Meteor = (function() {
    var _id;                //id unique d'une arme INT
    var _isActive           //détermine si l'évènement naturel est actif TinyINT
    var _origin_tile_id;    //lien vers l'user a qui appartient la arme INT
    var _longueur;          //longeur de la zone affectée INT
    var _largeur;           //largeur de la zone affectée INT
    var _duree;             //durée de l'évènement INT
    var _x;                 //coordonée en X de l'origine INT
    var _y;                 //coordonée en Y de l'origine INT

    function Meteor(){
        
    };

    Meteor.prototype.Add_Meteor = function(tile_id, duree, longueur, largeur, x, y, callback){
        var meteor = new Array();
        for( var i = 0; i < longueur; i++){
            for(var j = 0; j < largeur; j++){
                meteor.push({
                    x : x+i,
                    y : y+j
                });
            }
        }
        var connection = _DB.connection();
        connection.query('INSERT INTO Meteor(origin_tile_id, duree, longueur, largeur, x, y, isActive) VALUES('+tile_id+', '+duree+', '+longueur+', '+largeur+', '+x+', '+y+', 1)', function(err, rows, fields){
            if(err) throw err;
            callback(meteor);
        });
    };

    Meteor.prototype.isMeteor = function(callback){
        var connection = _DB.connection();
        var intervalMeteor = setInterval(function(){
            connection.query('SELECT * FROM Meteor WHERE isActive = 1', function(err, rows, fields){
                if(err) throw err;
                if(rows[0] != null){
                    if(rows[0].duree > 0){
                        var xmax = rows[0].x + rows[0].longueur -1;
                        var ymax = rows[0].y + rows[0].largeur -1;
                        connection.query('DELETE p.* FROM Plantes as p LEFT JOIN Tiles as t ON p.tile_id = t.id WHERE t.x >= '+rows[0].x+' AND t.x <= '+xmax+' AND t.y >='+rows[0].y+' AND t.y <= '+ymax, function(err, row, fields){
                            if(err) throw err;
                            connection.query('DELETE s.* FROM Stockages as s LEFT JOIN Tiles as t ON s.tile_id = t.id WHERE t.x >= '+rows[0].x+' AND t.x <= '+xmax+' AND t.y >='+rows[0].y+' AND t.y <= '+ymax, function(err, row, fields){
                                if(err) throw err;
                                connection.query('UPDATE Meteor SET duree = duree-1 WHERE id='+rows[0].id, function(err, row, fields){
                                    if(err) throw err;
                                     connection.query('UPDATE Tiles SET isEmpty = 0, sprite_id = 1 WHERE x >= '+rows[0].x+' AND x <= '+xmax+' AND y >='+rows[0].y+' AND y <= '+ymax, function(err, row, fields){
                                        if(err) throw err;
                                        callback(false);
                                    });
                                });
                            });
                        });
                    }else{
                        connection.query('DELETE FROM Meteor WHERE id='+rows[0].id, function(err, row, fields){
                            if(err) throw err;
                            var meteor = new Array();
                            for( var i = 0; i < rows[0].longueur; i++){
                                for(var j = 0; j < rows[0].largeur; j++){
                                    meteor.push({
                                        x : rows[0].x+i,
                                        y : rows[0].y+j
                                    });
                                }
                            }
                            callback(meteor);
                        });
                    }
                }else{
                    callback(false);
                }
            })
        },(10000));
    };

    //Getters
    Meteor.prototype.getId = function() {
        return _id;
    };
    Meteor.prototype.getIsActive = function() {
        return _isActive;
    };
    Meteor.prototype.getOriginTileId = function() {
        return _origin_tile_id;
    };
    Meteor.prototype.getLongueur = function() {
        return _longueur;
    };
    Meteor.prototype.getLargeur = function() {
        return _largeur;
    };
    Meteor.prototype.getDuree = function() {
        return _duree;
    };
    Meteor.prototype.getX = function() {
        return _x;
    };
    Meteor.prototype.getY = function() {
        return _y;
    };


    //Setters
    Meteor.prototype.setId = function(id) {
        _id = id;
    };
    Meteor.prototype.setIsActive = function(isActive) {
        _isActive = isActive;
    };
    Meteor.prototype.setOriginTileId = function(origin_tile_id) {
        _origin_tile_id = origin_tile_id;
    };
    Meteor.prototype.setLongueur = function(longueur) {
        _longueur = longueur;
    };
    Meteor.prototype.setLargeur = function(largeur) {
        _largeur = largeur;
    };
    Meteor.prototype.setDuree = function(duree) {
        _duree = duree;
    };
    Meteor.prototype.setX = function(x) {
        _x = x;
    };
    Meteor.prototype.setY = function(y) {
        _y = y;
    };
    

    return Meteor;
})();

module.exports = Meteor;
