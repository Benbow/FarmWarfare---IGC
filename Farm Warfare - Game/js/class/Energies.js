//Classe qui enregistre les batiments Energies de chaque user
var DB = require('./DB');

var Energies = (function() {
    var _id;                //id unique d'une arme INT
    var _isConstruct        //booléen de vérification de construction TinyINT
    var _user_id;           //lien vers l'user a qui appartient la arme INT
    var _energies_spec_id;  //lien vers le bon type de arme INT
    var _tile_id            //Lien vers la tile ou le bâtiment se trouve

    function Energies(){
        _DB = new DB();
    };

     Energies.prototype.buyEnergie = function(nb, user_id, callback){
        var connection = _DB.connection();
        var query = 'UPDATE Users SET energies = energies + '+nb+' WHERE id = '+user_id +';';
        connection.query(query,function(err, r, fields) {
            if (err) throw err;
            callback({
                nb : nb
            });
        }); 
    };

    //Getters
    Energies.prototype.getId = function() {
        return _id;
    };
    Energies.prototype.getIsConstruct = function() {
        return _isConstruct;
    };
    Energies.prototype.getUserId = function() {
        return _user_id;
    };
    Energies.prototype.getEnergiesSpecId = function() {
        return _energies_spec_id;
    };
    Energies.prototype.getTileId = function() {
        return _tile_id;
    };


    //Setters
    Energies.prototype.setId = function(id) {
        _id = id;
    };
    Energies.prototype.setIsConstruct = function(isConstruct) {
        _isConstruct = isConstruct;
    };
    Energies.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };
    Energies.prototype.setEnergiesSpecId = function(energies_spec_id) {
        _energies_spec_id = energies_spec_id;
    };
    Energies.prototype.setTileId = function(tile_id) {
        _tile_id = tile_id;
    };

    return Energies;
})();

module.exports = Energies;
