//Classe qui enregistre les Maisons de chaque user

var Maisons = (function() {
    var _id;            //id unique d'une arme INT
    var _tile_id        //lien vers la tile ou la maison est posé
    var _user_id;       //lien vers l'user a qui appartient la arme INT

    function Maisons(){
        
    };

    //Getters
    Maisons.prototype.getId = function() {
        return _id;
    };
    Maisons.prototype.getTileId = function() {
        return _tile_id;
    };
    Maisons.prototype.getUserId = function() {
        return _user_id;
    };
    

    //Setters
    Maisons.prototype.setId = function(id) {
        _id = id;
    };
    Maisons.prototype.setTileId = function(tile_id) {
        _tile_id = tile_id;
    };
    Maisons.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };
    

    return Maisons;
})();

module.exports = Maisons;