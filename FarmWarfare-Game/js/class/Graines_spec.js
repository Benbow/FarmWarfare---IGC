var DB = require('./DB');

//Classe indexant les différents types de graines du jeu

var Graines_spec = (function() {

    //attributs
    var _id;            //id unique d'une graine INT
    var _name;          //nom de la graine Varchar 45
    var _maturation;    //temps de maturation d'une graine, avant d'atteindre sa maturité INT
    var _pourrissement; //temps de pourrissement, avant que la graine ne pourrisse (après maturité) INT
    var _production;    //ratio maximale de fruit récoltable INT
    var _stockage;      //temps durant lequel la graine peut être stocké sans pourrir INT
    var _croissance;    //temps qu'il faudra pour passer au stade suivant INT
    var _poids;         //nombre d'unités de stockages que la graines va prendre INT
    var _prix;          //prix de la graine INT
    var _sante_min;     //santé minimum requise par la graine pour continuer sa croissance INT
    var _niveau_requis; //niveau que le joueur doit avoir pour acheter/utiliser la graine INT

    //Constructeurs
    function Graines_spec(){
        _DB = new DB();
    };

    //Methodes
    Graines_spec.prototype.Add_Graines = function(name, maturation, pourrissement, production, stockage, croissance, poids, prix, sante_min, niveau_requis){
        var query = 'INSERT INTO Graines_spec (name, maturation, pourrissement, production, stockage, croissance, poids, prix, sante_min, niveau_requis) VALUES ("'+name+'", '+maturation+', '+pourrissement+', '+production+', '+stockage+', '+croissance+', '+poids+', '+prix+', '+sante_min+', '+niveau_requis+');'
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            console.log("Graines_spec created");
        });
    };
    
    Graines_spec.prototype.Get_Graines = function(callback){
        var connection = _DB.connection();
        var query = 'SELECT * FROM Graines_spec;'
        connection.query(query,function(err, rows, fields) {
            if (err) throw err;
            callback(rows);
            
        });
    };


    Graines_spec.prototype.marketPriceGraines = function(){
        var connection = _DB.connection();         
        var rand1 = Math.floor((Math.random()*10)+1);        
        connection.query('UPDATE Graines_spec SET prix='+rand1+' Where id = 1;',function(err, rows, fields) {
            if (err) throw err;          
            });
        var rand2 = Math.floor((Math.random()*30)+10);        
        connection.query('UPDATE Graines_spec SET prix='+rand2+' Where id = 2;',function(err, rows, fields) {
            if (err) throw err;          
            });   
        var rand3 = Math.floor((Math.random()*60)+30);        
        connection.query('UPDATE Graines_spec SET prix='+rand3+' Where id = 3;',function(err, rows, fields) {
            if (err) throw err;          
            });   
        var rand4 = Math.floor((Math.random()*100)+60);        
        connection.query('UPDATE Graines_spec SET prix='+rand4+' Where id = 4;',function(err, rows, fields) {
            if (err) throw err;          
            });   
        var rand5 = Math.floor((Math.random()*200)+100);        
        connection.query('UPDATE Graines_spec SET prix='+rand5+' Where id = 5;',function(err, rows, fields) {
            if (err) throw err;          
            });
        var rand6 = Math.floor((Math.random()*1000)+200);        
        connection.query('UPDATE Graines_spec SET prix='+rand6+' Where id = 6;',function(err, rows, fields) {
            if (err) throw err;          
            });             
    };

    //Getters
    Graines_spec.prototype.getId = function() {
        return _id;
    };
    Graines_spec.prototype.getName = function() {
        return _name;
    };
    Graines_spec.prototype.getMaturation = function() {
        return _maturation;
    };
    Graines_spec.prototype.getPourrissement = function() {
        return _pourrissement;
    };
    Graines_spec.prototype.geProduction = function() {
        return _production;
    };
    Graines_spec.prototype.getStockage = function() {
        return _stockage;
    };
    Graines_spec.prototype.getCroissance = function() {
        return _croissance;
    };
    Graines_spec.prototype.getPoids = function() {
        return _poids;
    };
    Graines_spec.prototype.getPrix = function() {
        return _prix;
    };
    Graines_spec.prototype.getSanteMin = function() {
        return _sante_min;
    };
    Graines_spec.prototype.getNiveauRequis = function() {
        return _niveau_requis;
    };

    //Setters
    Graines_spec.prototype.setId = function(id) {
        _id = id;
    };
    Graines_spec.prototype.setName = function(name) {
        _name = name;
    };
    Graines_spec.prototype.setMaturation = function(maturation) {
        _maturation = maturation;
    };
    Graines_spec.prototype.setProduction = function(production) {
        _production = production;
    };
    Graines_spec.prototype.setPourrissement = function(pourrissement) {
        _pourrissement = pourrissement;
    };
    Graines_spec.prototype.setStockage = function(stockage) {
        _stockage = stockage;
    };
    Graines_spec.prototype.setCroissance = function(croissance) {
        _croissance = croissance;
    };
    Graines_spec.prototype.setPoids = function(poids) {
        _poids = poids;
    };
    Graines_spec.prototype.setPrix = function(prix) {
        _prix = prix;
    };
    Graines_spec.prototype.setSanteMin = function(sante_min) {
        _sante_min = sante_min;
    };
    Graines_spec.prototype.setNiveauRequis = function(niveau_requis) {
        _niveau_requis = niveau_requis;
    };
    
    
    return Graines_spec;
})();

module.exports = Graines_spec;
