var DB = require('./DB');
//Classe qui enregistre les Fruits_spec

var Fruits_spec = (function() {
    var _id;                //id unique d'un fruit INT
    var _name;              //nom du fruit String
    var _prix_vente;        //prix du fruit INT
    var _stockage           //temps de stockage du fruit INT
    var _poids              //poids du fruit INT

    function Fruits_spec(){
         _DB = new DB();
    };

    Fruits_spec.prototype.getFruitSpec = function(id, callback){
        var connection = _DB.connection();  
        var query = 'SELECT * FROM Fruits_spec WHERE id ='+id+' ;';
        connection.query(query,function(err, row, fields) {
            if (err) throw err;
            if( typeof(row[0]) != "undefined"){
                callback({
                    ok: true,
                    fruits_spec : row[0]
                });
            }else{
                callback({
                    ok: false
                })
            }
        });
    };

   Fruits_spec.prototype.marketPriceFruits = function(){
        var connection = _DB.connection(); 

        var rand1 = Math.floor((Math.random()*10)+1);        
        connection.query('UPDATE Fruits_spec SET prix_vente='+rand1+' Where id = 1;',function(err, rows, fields) {
            if (err) throw err;          
            });
        var rand2 = Math.floor((Math.random()*30)+10);        
        connection.query('UPDATE Fruits_spec SET prix_vente='+rand2+' Where id = 2;',function(err, rows, fields) {
            if (err) throw err;          
            });   
        var rand3 = Math.floor((Math.random()*60)+30);        
        connection.query('UPDATE Fruits_spec SET prix_vente='+rand3+' Where id = 3;',function(err, rows, fields) {
            if (err) throw err;          
            });   
        var rand4 = Math.floor((Math.random()*100)+60);        
        connection.query('UPDATE Fruits_spec SET prix_vente='+rand4+' Where id = 4;',function(err, rows, fields) {
            if (err) throw err;          
            });   
        var rand5 = Math.floor((Math.random()*200)+100);        
        connection.query('UPDATE Fruits_spec SET prix_vente='+rand5+' Where id = 5;',function(err, rows, fields) {
            if (err) throw err;          
            });
        var rand6 = Math.floor((Math.random()*1000)+200);        
        connection.query('UPDATE Fruits_spec SET prix_vente='+rand6+' Where id = 6;',function(err, rows, fields) {
            if (err) throw err;          
            });                     
    };

    //Getters
    Fruits_spec.prototype.getId = function() {
        return _id;
    };
    Fruits_spec.prototype.getName = function() {
        return _name;
    };
    Fruits_spec.prototype.getPrixVente = function() {
        return _prix_vente;
    };
    Fruits_spec.prototype.getStockage = function() {
        return _stockage;
    };
    Fruits_spec.prototype.getPoids = function() {
        return _poids;
    };


    //Setters
    Fruits_spec.prototype.setId = function(id) {
        _id = id;
    };
    Fruits_spec.prototype.setName = function(name) {
        _name = name;
    };
    Fruits_spec.prototype.setPrix = function(prix_vente) {
        _prix_vente = prix_vente;
    };
    Fruits_spec.prototype.setStockage = function(stockage) {
        _stockage = stockage;
    };
    Fruits_spec.prototype.setPoids = function(poids) {
        _poids = poids;
    };
    

    return Fruits_spec;
})();

module.exports = Fruits_spec;