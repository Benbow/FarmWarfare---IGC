//Classe qui enregistre les ACHATS de graines de chaque user

var Achats = (function() {
    var _id;                //id unique d'un achat INT
    var _date;              //date de l'achat
    var _graines_spec_id;   //lien vers la graines acheté

    function Achats(){
        
    };

    //Getters
    Achats.prototype.getId = function() {
        return _id;
    };
    Achats.prototype.getDate = function() {
        return _date;
    };
    Achats.prototype.getGrainesSpecId = function() {
        return _graines_spec_id;
    };


    //Setters
    Achats.prototype.setId = function(id) {
        _id = id;
    };
    Achats.prototype.setDate = function(date) {
        _date = date;
    };
    Achats.prototype.setGrainesSpecId = function(graines_spec_id) {
        _graines_spec_id = graines_spec_id;
    };

    return Achats;
})();

module.exports = Achats;
