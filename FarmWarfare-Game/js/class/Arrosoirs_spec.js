//Classe qui enregistre les Arrosoirs_spec

var Arrosoirs_spec = (function() {
    var _id;        //id unique de l'arrosoir INT
    var _name;      //nom de l'arrosoir Srtring
    var _prix;      //prix de l'arrosoir INT
    var _stockage   //quantité d'eau stocké INT

    function Arrosoirs_spec(){
        
    };

    //Getters
    Arrosoirs_spec.prototype.getId = function() {
        return _id;
    };
    Arrosoirs_spec.prototype.getName = function() {
        return _name;
    };
    Arrosoirs_spec.prototype.getPrix = function() {
        return _prix;
    };
    Arrosoirs_spec.prototype.getStockage = function() {
        return _stockage;
    };


    //Setters
    Arrosoirs_spec.prototype.setId = function(id) {
        _id = id;
    };
    Arrosoirs_spec.prototype.setName = function(name) {
        _name = name;
    };
    Arrosoirs_spec.prototype.setPrix = function(prix) {
        _prix = prix;
    };
    Arrosoirs_spec.prototype.setStockage = function(stockage) {
        _stockage = stockage;
    };

    return Arrosoirs_spec;
})();

module.exports = Arrosoirs_spec;
