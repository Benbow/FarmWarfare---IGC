//Classe qui enregistre les Arrosoirs de chaque user
var DB = require('./DB');
var Arrosoirs = (function() {
    var _id;            //id unique d'une arme INT
    var _user_id;       //lien vers l'user a qui appartient la arme INT
    var _arrosoirs_spec_id; //lien vers le bon type de arme INT

    function Arrosoirs(){
        _DB = new DB();
    };

    Arrosoirs.prototype.fill_arrosoir = function(user_id, callback){
        var connection = _DB.connection();
        connection.query('SELECT * FROM Arrosoirs_spec WHERE id=1', function(err, rows, fields){
            if (err) throw err;
            connection.query('UPDATE Arrosoirs SET current = '+rows[0].stockage+' WHERE user_id = '+user_id+';', function(err, row, fields){
                if(err) throw err;
                callback(true);
            });
        });
    };

    //Getters
    Arrosoirs.prototype.getId = function() {
        return _id;
    };
    Arrosoirs.prototype.getUserId = function() {
        return _user_id;
    };
    Arrosoirs.prototype.getArrosoirsSpecId = function() {
        return _arrosoirs_spec_id;
    };


    //Setters
    Arrosoirs.prototype.setId = function(id) {
        _id = id;
    };
    Arrosoirs.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };
    Arrosoirs.prototype.setArrosoirsSpecId = function(arrosoirs_spec_id) {
        _arrosoirs_spec_id = arrosoirs_spec_id;
    };

    return Arrosoirs;
})();

module.exports = Arrosoirs;
