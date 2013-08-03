//Classe qui enregistre les Armes de chaque user
var DB = require('./DB');

var Armes = (function() {
    var _id;            //id unique d'une arme INT
    var _user_id;       //lien vers l'user a qui appartient la arme INT
    var _armes_spec_id; //lien vers le bon type de arme INT

    function Armes(){
    _DB = new DB();
    };

     Armes.prototype.buyArme = function(user_id, armes_spec_id, callback){
        var connection = _DB.connection();
        var query ='SELECT * FROM Armes WHERE user_id= ' + user_id + ';';
        connection.query(query,function(err, row, fields) {
            console.log(row);
            if (err) throw err;
            if(typeof( row[0]) != "undefined"){
                console.log("lol");
               var query = connection.query('UPDATE Armes SET armes_spec_id = '+armes_spec_id+' WHERE user_id = '+user_id + ';' ,function(err, r, fields) {
                    console.log(query);
                    if(err) throw err;
                    callback(true);
                });
            }else{
                 connection.query('INSERT INTO Armes (user_id, armes_spec_id) VALUES ('+user_id+' , '+armes_spec_id+');' ,function(err, r, fields) {
                    if(err) throw err;
                    callback(true);
                });
            }
        
        });
    };

    //Getters
    Armes.prototype.getId = function() {
        return _id;
    };
    Armes.prototype.getUserId = function() {
        return _user_id;
    };
    Armes.prototype.getArmesSpecId = function() {
        return _Armes_spec_id;
    };


    //Setters
    Armes.prototype.setId = function(id) {
        _id = id;
    };
    Armes.prototype.setUserId = function(user_id) {
        _user_id = user_id;
    };
    Armes.prototype.setArmesSpecId = function(Armes_spec_id) {
        _Armes_spec_id = Armes_spec_id;
    };

    return Armes;
})();

module.exports = Armes;
