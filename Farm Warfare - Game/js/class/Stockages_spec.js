var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor',
    database : 'farmDB',
});

//Classe indexant les différents types de bâtiments de stockages du jeu

var Stockages_spec = (function() {

    //attributs
    var _id;            //id unique d'un bâtiments de stockages INT
    var _name;          //nom du bâtiments de stockages Varchar 45
    var _taille;        //nombre de cases prises par le bâtiments de stockages INT
    var _prix;          //prix du bâtiments de stockages INT
    var _stockage;      //Contenance maximale du bâtiments de stockages INT
    var _consommation;  //consommation d'énergies par minute INT 
    var _constructTime; //temps de construction du bâtiments de stockages INT
    var _niveau_requis; //niveau que le joueur doit avoir pour acheter/utiliser la graine INT

    //Constructeurs
    function Stockages_spec(){
        
    };

    //Methodes
    Stockages_spec.prototype.Add_Stockages_spec = function(name, taille, prix, stockage, consommation, constructTime, niveau_requis){
        var query = 'INSERT INTO Stockages_spec (name, taille, prix, stockage, consommation, constructionTime, niveau_requis) VALUES ("'+name+'", '+taille+', '+prix+', '+stockage+', '+consommation+', '+constructTime+','+niveau_requis+');';
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            console.log("Stockages_spec created");
        });
    };

    Stockages_spec.prototype.Delete_Stockages_spec = function(id){
        var query = 'DELETE FROM Stockages_spec WHERE id='+id;
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            console.log("Stockages_spec deleted");
        });
    };

    
    //Getters
    Stockages_spec.prototype.getId = function() {
        return _id;
    };
    Stockages_spec.prototype.getName = function() {
        return _name;
    };
    Stockages_spec.prototype.getTaille = function() {
        return _taille;
    };
    Stockages_spec.prototype.getPrix = function() {
        return _prix;
    };
    Stockages_spec.prototype.getStockage = function() {
        return _stockage;
    };
    Stockages_spec.prototype.getConsommation = function() {
        return _consommation;
    };
    Stockages_spec.prototype.getConstrucTime = function() {
        return _constructTime;
    };
    Stockages_spec.prototype.getNiveauRequis = function() {
        return _niveau_requis;
    };

    //Setters
    Stockages_spec.prototype.setId = function(id) {
        _id = id;
    };
    Stockages_spec.prototype.setName = function(name) {
        _name = name;
    };
    Stockages_spec.prototype.setTaille = function(taille) {
        _taille = taille;
    };
    Stockages_spec.prototype.setPrix = function(prix) {
        _prix = prix;
    };
    Stockages_spec.prototype.setStockage = function(stockage) {
        _stockage = stockage;
    };
    Stockages_spec.prototype.setConsommation = function(consommation) {
        _consommation = consommation;
    };
    Stockages_spec.prototype.setConstructTime = function(constructTime) {
        _constructTime = constructTime;
    };
    Stockages_spec.prototype.setNiveauRequis = function(niveau_requis) {
        _niveau_requis = niveau_requis;
    };
    
    
    return Stockages_spec;
})();

module.exports = Stockages_spec;
