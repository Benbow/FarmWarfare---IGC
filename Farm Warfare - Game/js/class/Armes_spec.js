var DB = require('./DB');
//Classe indexant les différents types d'armes du jeu

var Armes_spec = (function() {
    var _id;   		//id unique d'une arme INT
    var _name;		//nom de l'arme VarChar
    var _puissance;	//puissance de l'arme, dégats INT
    var _precision;	//precision de l'arme, pourcentage INT
    var _vitesse;	//vitesse d'attaque de l'arme INT
    var _prix;		//prix de l'arme INT

    function Armes_spec(){
        _DB = new DB();
    };


    Armes_spec.prototype.Get_Armes = function(callback){
        var connection = _DB.connection();
        var query = 'SELECT * FROM Armes_spec;'
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            callback(rows);
            
        });
    };

    //Getters
    Armes_spec.prototype.getId = function() {
        return _id;
    };
    Armes_spec.prototype.getName = function() {
        return _name;
    };
    Armes_spec.prototype.getPuissance = function() {
        return _puissance;
    };
     Armes_spec.prototype.getPrecision = function() {
        return _precision;
    };
     Armes_spec.prototype.getVitesse = function() {
        return _vitesse;
    };
     Armes_spec.prototype.getPrix = function() {
        return _prix;
    };


    //Setters
    Armes_spec.prototype.setId = function(id) {
        _id = id;
    };
    Armes_spec.prototype.setName = function(name) {
        _name = name;
    };
    Armes_spec.prototype.setPuissance = function(puissance) {
        _puissance = puissance;
    };
    Armes_spec.prototype.setPrecision = function(precision) {
        _precision = precision;
    };
    Armes_spec.prototype.setVitesse = function(vitesse) {
        _vitesse = vitesse;
    };
    Armes_spec.prototype.setPrix = function(prix) {
        _prix = prix;
    };
    
    return Armes_spec;
})();

module.exports = Armes_spec;
